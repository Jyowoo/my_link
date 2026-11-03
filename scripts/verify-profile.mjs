import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(path, imports) {
  const exports = {};
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(output, { exports, require: (name) => { if (!(name in imports)) throw Error(name); return imports[name]; }, URL, Intl });
  return exports;
}
const validation = load("src/lib/user-profile.ts", {});
assert.equal(validation.displayNameKey(" Ｔｅｓｔ "), "test");
assert.ok(validation.validateProfile({ displayName: "a", bio: "" }).displayName);
assert.ok(validation.validateProfile({ displayName: "valid", bio: "a".repeat(201) }).bio);
assert.ok(validation.validateProfile({ displayName: "bad/name", bio: "" }).displayName);
const records = new Map();
let version = 0;
const snapshot = (data) => ({ exists: () => data !== undefined, data: () => data });
const sdk = {
  doc: (_, ...parts) => parts.join("/"),
  serverTimestamp: () => "server-time",
  getDocFromServer: async (path) => snapshot(records.get(path)),
  runTransaction: async (_, callback) => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const revision = version;
      const before = new Map(records);
      const writes = [];
      let writing = false;
      const result = await callback({
        get: async (path) => { assert.equal(writing, false, "all reads precede writes"); return snapshot(before.get(path)); },
        set: (path, value, options) => { writing = true; writes.push(() => records.set(path, options?.merge ? { ...records.get(path), ...value } : value)); },
        delete: (path) => { writing = true; writes.push(() => records.delete(path)); },
      });
      if (revision !== version) continue;
      writes.forEach((write) => write()); version++;
      return result;
    }
    throw Error("Transaction retries exhausted");
  },
};
function client(uid, email) {
  const user = { uid, email };
  const auth = { currentUser: user };
  return { user, auth, ...load("src/lib/profile-store.ts", { "firebase/firestore": sdk, "@/lib/firebase": { auth, firestore: {} }, "@/lib/user-profile": validation }) };
}
const a = client("accountA", "same@example.com"), b = client("accountB", "same@other.com");
await a.initializeUserProfile(a.user);
await b.initializeUserProfile(b.user);
assert.equal(records.get("users/accountA").displayName, "same");
assert.equal(records.get("users/accountB").displayName, "same-accountB");
assert.equal(records.get("displayNames/same").email, undefined, "public projection excludes email");
assert.equal(records.get("displayNames/same").displayName, "same");
const draft = (displayName) => ({ displayName, bio: "소개" });
await a.saveUserProfile(a.user, draft("MyName"));
assert.equal(await b.isDisplayNameAvailable(b.user.uid, "myname"), false);
await assert.rejects(b.saveUserProfile(b.user, draft("MYNAME")), /이미 사용/);
assert.equal(records.get("displayNames/myname").uid, a.user.uid);
assert.equal(records.has("displayNames/same"), false);
await a.initializeUserProfile(a.user);
assert.equal(records.get("users/accountA").displayName, "MyName", "login must preserve a customized name");
assert.equal(records.get("users/accountA").bio, "소개");
assert.equal(records.get("displayNames/myname").bio, "소개");
assert.equal(records.get("displayNames/myname").displayName, "MyName");
await a.saveUserProfile(a.user, draft("OtherName"));
assert.equal(await b.isDisplayNameAvailable(b.user.uid, "myname"), true);
assert.equal(records.has("displayNames/myname"), false);
const race = await Promise.allSettled([a.saveUserProfile(a.user, draft("RaceName")), b.saveUserProfile(b.user, draft("racename"))]);
assert.equal(race.filter((result) => result.status === "fulfilled").length, 1, "exactly one concurrent claimant wins");
assert.equal(race.filter((result) => result.status === "rejected").length, 1);
for (const [path, profile] of records) {
  if (path.startsWith("users/")) assert.equal(records.get("displayNames/" + profile.displayNameKey).uid, path.split("/")[1]);
}
a.auth.currentUser = { uid: "different-account" };
await assert.rejects(a.saveUserProfile(a.user, draft("StaleName")), /로그인 상태/);
assert.equal(records.has("displayNames/stalename"), false);
console.log("PASS: profile validation, case/Unicode normalization, initial collisions, custom name persistence, atomic rename/release, concurrent uniqueness, account-change rejection.");
