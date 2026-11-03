import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise component handlers and Firestore contracts without touching a live database.
const jsx = (type, props) => ({ type, props });
function harness() {
  const slots = [];
  let cursor = 0;
  let cleanup;
  return {
    react: {
      useId: () => "test-form",
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
        return [slots[index], (next) => { slots[index] = typeof next === "function" ? next(slots[index]) : next; }];
      },
      useRef(initial) {
        const index = cursor++;
        return slots[index] ??= { current: initial };
      },
      createContext: () => ({ Provider: "Provider" }),
      useContext: () => null,
      useEffect(effect) {
        const index = cursor++;
        if (!slots[index]) { slots[index] = true; cleanup = effect(); }
      },
    },
    render(component) { cursor = 0; return component(); },
    cleanup: () => cleanup?.(),
  };
}
function load(path, imports) {
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports,
    require(name) {
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (name in imports) return imports[name];
      if (name.startsWith("@/components/ui/") || name === "lucide-react") return new Proxy({}, { get: (_, key) => key });
      throw new Error("Unexpected import: " + name);
    },
    Set,
    FormData: class { constructor(form) { this.data = form; } get(key) { return this.data[key]; } },
    console: { error() {} }, URL, Intl,
  });
  return exports;
}
function find(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const match = find(child, predicate);
    if (match) return match;
  }
  return null;
}
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const link = { id: "existing-id", title: "원래 링크", url: "https://example.com/old", description: "설명", category: "blog", icon: "BookOpen", actionText: "링크 열기", isExternal: true, badge: null, displayOrder: 7 };
const draft = { title: "수정 링크", url: "https://example.com/new", description: "새 설명", category: "blog", actionText: "열기", badge: "" };
const { validateLink } = load("src/lib/links.ts", {});

const formHarness = harness();
let saveCalls = 0;
let saving = deferred();
const formProps = { initialValue: link, onSave: () => { saveCalls++; return saving.promise; }, onCancel() {} };
const { LinkForm } = load("src/components/links/link-form.tsx", { react: formHarness.react, "@/lib/links": { validateLink } });
const form = () => formHarness.render(() => LinkForm(formProps));
let tree = form();
assert.equal(find(tree, (n) => n.props?.name === "title").props.defaultValue, link.title);
const submit = (values) => form().props.onSubmit({ preventDefault() {}, currentTarget: values });
await submit({ ...draft, title: " " });
assert.equal(saveCalls, 0);
assert.ok(find(form(), (n) => n.props?.role === "alert"));
find(form(), (n) => n.props?.name === "url").props.onChange({ target: { value: "javascript:alert(1)" } });
await submit(draft);
assert.equal(saveCalls, 0);
find(form(), (n) => n.props?.name === "url").props.onChange({ target: { value: draft.url } });
const pendingSave = submit(draft);
assert.equal(form().props["aria-busy"], true);
await submit(draft);
assert.equal(saveCalls, 1);
saving.reject(new Error("permission-denied"));
await pendingSave;
assert.equal(form().props["aria-busy"], false);
assert.ok(find(form(), (n) => n.props?.role === "alert"));
assert.equal(find(form(), (n) => n.props?.name === "url").props.value, "example.com/new");
saving = deferred();
const retry = submit(draft);
saving.resolve();
await retry;
assert.equal(saveCalls, 2);

const providerHarness = harness();
let session = { user: { uid: "test-user" }, loading: false };
const mockAuth = { currentUser: session.user };
let listener, stopped = false;
const writes = [];
let failure = null;
const sdk = {
  collection: (_, ...parts) => parts.join("/"), doc: (_, ...parts) => parts.join("/"),
  orderBy: (field) => field, query: (path) => path, serverTimestamp: () => "server-time",
  onSnapshot: (path, options, next) => { assert.equal(path, "users/test-user/links"); assert.equal(options.includeMetadataChanges, true); listener = next; return () => { stopped = true; }; },
  addDoc: async (...args) => { writes.push(["add", ...args]); },
  updateDoc: async (...args) => { if (failure) throw failure; writes.push(["update", ...args]); },
  deleteDoc: async (...args) => { if (failure) throw failure; writes.push(["delete", ...args]); },
};
const { LinksProvider } = load("src/components/links/links-provider.tsx", { react: providerHarness.react, "firebase/firestore": sdk, "@/lib/firebase": { firestore: {}, auth: mockAuth }, "@/components/auth/auth-provider": { useAuth: () => session } });
const renderProvider = () => providerHarness.render(() => {
  const root = LinksProvider({ children: null });
  return typeof root.type === "function" ? root.type(root.props) : root;
});
const provider = () => renderProvider().props.value;
session = { user: null, loading: false }; mockAuth.currentUser = null;
assert.equal(provider().links.length, 0);
await assert.rejects(provider().addLink(draft), /로그인/);
assert.equal(listener, undefined, "guests must never subscribe to Firestore");
session = { user: { uid: "test-user" }, loading: false }; mockAuth.currentUser = session.user;
provider();
listener({ metadata: { hasPendingWrites: false }, docs: [{ id: link.id, data: () => link }] });
assert.equal(provider().links.length, 1);
listener({ metadata: { hasPendingWrites: true }, docs: [] });
assert.equal(provider().links.length, 1, "pending mutations must retain the card and edit form");
await provider().updateLink(link.id, draft);
assert.equal(writes[0][1], "users/test-user/links/existing-id");
assert.equal(writes[0][2].updatedAt, "server-time");
assert.equal("displayOrder" in writes[0][2], false);
assert.equal("createdAt" in writes[0][2], false);
const deletionPending = provider().deleteLink(link.id);
listener({ metadata: { hasPendingWrites: false }, docs: [] });
assert.equal(provider().links.length, 1, "local delete must retain the card until server confirmation");
await deletionPending;
assert.equal(provider().links.length, 0);
assert.equal(writes[1][1], "users/test-user/links/existing-id");
failure = new Error("permission-denied");
await assert.rejects(provider().updateLink(link.id, draft), /permission-denied/);
await assert.rejects(provider().deleteLink(link.id), /permission-denied/);
const oldActions = provider();
mockAuth.currentUser = { uid: "other-user" };
await assert.rejects(oldActions.updateLink(link.id, draft), /로그인 상태/);
await assert.rejects(oldActions.deleteLink(link.id), /로그인 상태/);
session = { user: mockAuth.currentUser, loading: false };
assert.equal(LinksProvider({ children: null }).props.uid, "other-user");
session = { user: null, loading: false }; mockAuth.currentUser = null;
assert.equal(LinksProvider({ children: null }).props.value.links.length, 0);
providerHarness.cleanup();
listener({ metadata: { hasPendingWrites: false }, docs: [{ id: "stale", data: () => link }] });
assert.equal(stopped, true);

const cardHarness = harness();
let deletions = 0;
const deleteRequest = deferred();
const { LinkCard } = load("src/components/links/link-card.tsx", {
  react: cardHarness.react,
  "@/components/links/link-form": { LinkForm: "LinkForm" },
  "@/components/links/links-provider": { useLinks: () => ({ error: null, updateLink: async () => {}, deleteLink: () => { deletions++; return deleteRequest.promise; } }) },
});
const card = () => cardHarness.render(() => LinkCard({ link, mode: "manage" }));
const profileCard = cardHarness.render(() => LinkCard({ link, mode: "view" }));
assert.equal(find(profileCard, (n) => n.props?.["aria-label"] === link.title + " 수정"), null);
assert.equal(find(profileCard, (n) => n.props?.["aria-label"] === link.title + " 삭제"), null);
assert.ok(find(profileCard, (n) => n.type === "a" && n.props.href === link.url));
tree = card();
assert.ok(find(tree, (n) => n.props?.["aria-label"] === link.title + " 수정"));
assert.ok(find(tree, (n) => n.props?.["aria-label"] === link.title + " 삭제"));
assert.equal(tree.type, "Card");
find(tree, (n) => n.type === "Dialog").props.onOpenChange(true);
tree = card();
assert.ok(find(tree, (n) => n.type === "DialogTitle" && n.props.children === "정말 삭제하시겠습니까?"));
assert.ok(find(tree, (n) => n.props?.children === "이 작업은 되돌릴 수 없습니다" && n.props.className.includes("text-red-600")));
find(tree, (n) => n.type === "Button" && n.props.children === "취소").props.onClick();
assert.equal(find(card(), (n) => n.type === "Dialog").props.open, false);
assert.equal(deletions, 0);
find(card(), (n) => n.type === "Dialog").props.onOpenChange(true);
const deletion = find(card(), (n) => n.type === "Button" && n.props.children === "삭제하기").props.onClick();
assert.equal(deletions, 1);
find(card(), (n) => n.type === "Dialog").props.onOpenChange(false);
assert.equal(find(card(), (n) => n.type === "Dialog").props.open, true);
deleteRequest.reject(new Error("permission-denied"));
await deletion;
assert.ok(find(card(), (n) => n.props?.role === "alert"));
assert.equal(find(card(), (n) => n.type === "Dialog").props.open, true);
console.log("PASS: shared validation, duplicate submit guard, failed save retry, Firestore paths and metadata preservation, pending snapshot retention, delete cancellation and failure.");
