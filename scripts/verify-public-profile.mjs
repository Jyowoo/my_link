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
const names = load("src/lib/user-profile.ts", {});
const links = load("src/lib/links.ts", {});
let record = null, failure = false;
const reads = [];
const sdk = {
  doc: (_, ...parts) => parts.join("/"), collection: (_, ...parts) => parts.join("/"),
  orderBy: (field) => field, query: (path) => path,
  getDocFromServer: async (path) => { reads.push(path); if (failure) throw Error("permission-denied"); return { exists: () => !!record, data: () => record }; },
  getDocsFromServer: async (path) => { reads.push(path); return { docs: [
    { id: "valid", data: () => ({ title: "링크", url: "https://example.com", displayOrder: 1 }) },
    { id: "unsafe", data: () => ({ title: "위험", url: "javascript:alert(1)" }) },
  ] }; },
};
const { getPublicProfile } = load("src/lib/public-profile.ts", { "firebase/firestore": sdk, "@/lib/firebase": { firestore: {} }, "@/lib/user-profile": names, "@/lib/links": links });
assert.equal(await getPublicProfile("links"), null);
assert.equal(await getPublicProfile("bad/name"), null);
assert.equal(reads.length, 0);
assert.equal(await getPublicProfile("Missing"), null);
assert.equal(reads.at(-1), "usernames/missing");
record = { uid: "owner-uid", username: "myname", displayName: "정철훈", bio: "소개", photoURL: "", email: "private@example.com" };
const profile = await getPublicProfile("MYNAME");
assert.equal(reads.at(-1), "users/owner-uid/links");
assert.equal(profile.displayName, "정철훈");
assert.equal(profile.links.length, 1);
assert.equal(profile.links[0].id, "valid");
assert.equal("email" in profile, false);
assert.equal(reads.some((path) => path === "users/owner-uid"), false);
record = { uid: "owner-uid", username: "othername", displayName: "OtherName" };
assert.equal(await getPublicProfile("MyName"), null);
record = { uid: "owner-uid", username: "myname", displayName: "정철훈", bio: "", photoURL: "" };
assert.equal(await getPublicProfile(encodeURIComponent("정철훈")), null);
assert.equal((await getPublicProfile("%6d%79%6e%61%6d%65")).displayName, "정철훈");
assert.equal(await getPublicProfile("정철훈"), null);
assert.equal(await getPublicProfile("%not-valid"), null);
assert.equal(await getPublicProfile("%252F"), null);
failure = true;
await assert.rejects(getPublicProfile("MyName"), /permission-denied/);
assert.equal(names.publicProfilePath("한글+이름"), "/" + encodeURIComponent("한글+이름"));
console.log("PASS: missing/reserved names, case-insensitive lookup, owner link path, private email exclusion, unsafe link filtering, backend error propagation.");
