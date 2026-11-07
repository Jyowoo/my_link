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
function load(path, imports, globals = {}) {
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
    console: { error() {} }, URL, Intl, ...globals,
  });
  return exports;
}
const { getEmailDisplayName, publicProfilePath } = load("src/lib/user-profile.ts", {});
assert.equal(getEmailDisplayName("sample.name+tag@example.com"), "sample.name+tag");
assert.equal(getEmailDisplayName(null), "사용자");
assert.equal(getEmailDisplayName(""), "사용자");
const h = harness();
const auth = { currentUser: null };
let nextAuth, authError;
let popupFailure = null, logoutFailure = null;
let popupHandler = null, profileWrite = null;
const writes = [];
let accountsRequested = false;
const user = { uid: "google-user", displayName: "테스트 사용자", email: "test@example.com", photoURL: "https://example.com/avatar.png" };
const authSdk = {
  GoogleAuthProvider: class { setCustomParameters(value) { accountsRequested = value.prompt === "select_account"; } },
  onAuthStateChanged: (_, next, error) => { nextAuth = next; authError = error; return () => {}; },
  signInWithPopup: async () => { if (popupHandler) return popupHandler(); if (popupFailure) throw popupFailure; auth.currentUser = user; nextAuth(user); return { user }; },
  signOut: async () => { if (logoutFailure) throw logoutFailure; auth.currentUser = null; nextAuth(null); },
};
const firestoreSdk = {
  doc: (_, ...parts) => parts.join("/"), serverTimestamp: () => "server-time",
  setDoc: async (...args) => { writes.push(args); if (profileWrite) await profileWrite; }, onSnapshot: () => () => {},
};
const initializeUserProfile = async (value) => {
  writes.push(["users/" + value.uid, { displayName: getEmailDisplayName(value.email), email: value.email }, { merge: true }]);
  if (profileWrite) await profileWrite;
};
const { AuthProvider } = load("src/components/auth/auth-provider.tsx", { "@/lib/profile-store": { initializeUserProfile }, react: h.react, "firebase/auth": authSdk, "firebase/firestore": firestoreSdk, "@/lib/firebase": { auth, firestore: {} } });
const state = () => h.render(() => AuthProvider({ children: null })).props;
assert.equal(state().loading, true);
nextAuth(null);
assert.equal(state().loading, false);
assert.equal(state().user, null);
await state().login();
assert.equal(accountsRequested, true);
assert.equal(state().user.uid, user.uid);
assert.equal(writes[0][0], "users/google-user");
assert.equal(writes[0][1].email, user.email);
assert.equal(writes[0][1].displayName, "test");
assert.equal(writes[0][2].merge, true);
assert.equal(state().busy, false);
logoutFailure = new Error("offline");
await state().logout();
assert.ok(state().error);
assert.equal(state().user.uid, user.uid);
logoutFailure = null;
await state().logout();
assert.equal(state().user, null);
popupFailure = { code: "auth/popup-closed-by-user" };
await state().login();
assert.equal(state().error, null);
popupFailure = { code: "auth/operation-not-allowed" };
await state().login();
assert.match(state().error, /활성화/);
authError({ code: "auth/network-request-failed" });
assert.equal(state().loading, false);
assert.equal(state().user, null);
popupFailure = null;
const attempts = [];
popupHandler = () => new Promise((resolve, reject) => attempts.push({ resolve, reject }));
const firstAttempt = state().login();
assert.equal(state().busy, false, "popup waiting must not lock the login button");
const secondAttempt = state().login();
assert.equal(attempts.length, 2, "retry is available before delayed popup cancellation settles");
attempts[0].reject({ code: "auth/unauthorized-domain" });
await firstAttempt;
assert.equal(state().error, null, "a stale popup must not overwrite the current attempt");
attempts[1].reject({ code: "auth/popup-closed-by-user" });
await secondAttempt;
assert.equal(state().busy, false);
popupHandler = null;
let rejectProfile;
profileWrite = new Promise((_, reject) => { rejectProfile = reject; });
await state().login();
assert.equal(state().user.uid, user.uid);
assert.equal(state().busy, false, "profile writes must not block logout");
await state().logout();
rejectProfile(new Error("offline"));
await Promise.resolve(); await Promise.resolve();
assert.equal(state().error, null, "a previous user profile failure must not leak after logout");
const { LoginNotice, AuthControls } = load("src/components/auth/auth-controls.tsx", {
  "@/components/auth/profile-menu": { ProfileMenu: "ProfileMenu" }, "@/lib/user-profile": { getEmailDisplayName, publicProfilePath }, "next/link": { default: "Link" }, "@/components/auth/auth-provider": { useAuth: () => state() },
});
assert.equal(JSON.stringify(LoginNotice()).includes("Google로 시작하기"), false);
assert.equal(JSON.stringify(LoginNotice()).includes("Button"), false);
assert.equal(JSON.stringify(AuthControls()).includes("Google로 로그인"), true);
const menuHarness = harness();
const notifications = [];
let clipboardFailure = false, copiedUrl = null, logoutCalls = 0;
const { ProfileMenu } = load("src/components/auth/profile-menu.tsx", {
  "next/link": { default: "Link" }, sonner: { toast: { success: (...args) => notifications.push(["success", ...args]), error: (...args) => notifications.push(["error", ...args]) } }, react: menuHarness.react, "@/lib/user-profile": { getEmailDisplayName, publicProfilePath },
  "@/components/auth/auth-provider": { useAuth: () => ({ user, profile: { displayName: "test", displayNameKey: "test", username: "test" }, busy: false, logout: async () => { logoutCalls++; } }) },
}, { navigator: { clipboard: { writeText: async (text) => { if (clipboardFailure) throw Error("blocked"); copiedUrl = text; } } }, window: { location: { origin: "https://mylink.example" } } });
function findNode(node, predicate) {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) { const match = findNode(child, predicate); if (match) return match; }
  return null;
}
const menu = () => menuHarness.render(() => ProfileMenu());
const copyItem = () => findNode(menu(), (n) => n.type === "DropdownMenuItem" && [n.props.children].flat().includes("링크 복사"));
await copyItem().props.onSelect();
assert.equal(copiedUrl, "https://mylink.example/test");
assert.equal(notifications.at(-1)[0], "success");
assert.equal(notifications.at(-1)[2].id, "profile-link-copy");
clipboardFailure = true;
await copyItem().props.onSelect();
assert.equal(notifications.at(-1)[0], "error");
assert.equal(notifications.at(-1)[2].id, "profile-link-copy");
const previewLink = findNode(menu(), (n) => n.type === "a" && n.props.href === "/preview");
assert.equal(previewLink.props.target, "_blank");
assert.equal(previewLink.props.rel, "noopener noreferrer");
await findNode(menu(), (n) => n.type === "DropdownMenuItem" && [n.props.children].flat().includes("로그아웃")).props.onSelect();
assert.equal(logoutCalls, 1);
h.cleanup();
console.log("PASS: auth loading, login/logout, header-only login, delayed popup cancellation and immediate retry, stale errors, nonblocking profile writes.");
