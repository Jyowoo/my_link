import { doc, getDocFromServer, runTransaction, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { normalizeUsername, validateUsername, displayNameKey, getEmailDisplayName, normalizeDisplayName, validateProfile, type ProfileDraft } from "@/lib/user-profile";

export class NameTakenError extends Error {
  constructor() { super("이미 사용 중인 이름이에요. 다른 이름을 입력해주세요."); this.name = "NameTakenError"; }
}
export class UsernameTakenError extends Error {
  constructor() { super("이미 사용 중인 주소예요. 다른 주소 아이디를 입력해주세요."); this.name = "UsernameTakenError"; }
}
export async function isUsernameAvailable(uid: string, username: string) {
  requireOwner(uid);
  if (validateUsername(username)) return false;
  const record = await getDocFromServer(doc(firestore, "usernames", normalizeUsername(username)));
  requireOwner(uid);
  return !record.exists() || record.data().uid === uid;
}
function requireOwner(uid: string) {
  if (auth.currentUser?.uid !== uid) throw new Error("로그인 상태가 변경되었어요. 다시 로그인해주세요.");
}
export async function isDisplayNameAvailable(uid: string, name: string) {
  requireOwner(uid);
  if (validateProfile({ displayName: name, bio: "" }).displayName) return false;
  const reservation = await getDocFromServer(doc(firestore, "displayNames", displayNameKey(name)));
  requireOwner(uid);
  return !reservation.exists() || reservation.data().uid === uid;
}
async function writeProfile(user: User, draft: ProfileDraft | null, attempt = 0, addressAttempt = 0) {
  requireOwner(user.uid);
  return runTransaction(firestore, async (transaction) => {
    requireOwner(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    const existing = (await transaction.get(userRef)).data();
    const original = typeof existing?.displayName === "string" ? existing.displayName : getEmailDisplayName(user.email);
    let name = draft ? normalizeDisplayName(draft.displayName) : normalizeDisplayName(original);
    if (!draft && validateProfile({ displayName: name, bio: "" }).displayName) {
      name = name.replace(/[^a-zA-Z0-9가-힣._+-]/g, "").slice(0, 30);
      if (validateProfile({ displayName: name, bio: "" }).displayName) name = "사용자";
    }
    if (!draft && attempt && existing?.displayNameKey !== displayNameKey(name)) {
      const suffix = "-" + user.uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) + (attempt > 1 ? attempt : "");
      name = name.slice(0, 30 - suffix.length) + suffix;
    }
    const key = displayNameKey(name);
    const reservationRef = doc(firestore, "displayNames", key);
    const reservation = await transaction.get(reservationRef);
    if (reservation.exists() && reservation.data().uid !== user.uid) throw new NameTakenError();
    const oldKey = typeof existing?.displayNameKey === "string" ? existing.displayNameKey : null;
    const oldRef = oldKey && oldKey !== key ? doc(firestore, "displayNames", oldKey) : null;
    const oldReservation = oldRef ? await transaction.get(oldRef) : null;
    let username = normalizeUsername(draft?.username ?? (typeof existing?.username === "string" ? existing.username : ""));
    if (!username || (!draft && validateUsername(username))) {
      username = getEmailDisplayName(user.email).toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/^-+/, "").slice(0, 30);
      if (validateUsername(username)) username = "user-" + user.uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase();
    }
    if (!draft && addressAttempt && (typeof existing?.username !== "string" || validateUsername(existing.username))) {
      const suffix = "-" + user.uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase() + (addressAttempt > 1 ? addressAttempt : "");
      username = username.slice(0, 30 - suffix.length) + suffix;
    }
    const addressRef = doc(firestore, "usernames", username);
    const address = await transaction.get(addressRef);
    if (address.exists() && address.data().uid !== user.uid) throw new UsernameTakenError();
    const oldUsername = typeof existing?.username === "string" ? existing.username : null;
    const oldAddressRef = oldUsername && oldUsername !== username ? doc(firestore, "usernames", oldUsername) : null;
    const oldAddress = oldAddressRef ? await transaction.get(oldAddressRef) : null;
    requireOwner(user.uid);
    const bio = draft ? draft.bio.trim() : typeof existing?.bio === "string" ? existing.bio : "";
    const photoURL = typeof existing?.photoURL === "string" ? existing.photoURL : user.photoURL ?? "";
    transaction.set(reservationRef, { uid: user.uid, displayName: name, username, bio, photoURL });
    transaction.set(addressRef, { uid: user.uid, displayName: name, username, bio, photoURL });
    if (oldAddressRef && oldAddress?.data()?.uid === user.uid) transaction.delete(oldAddressRef);
    if (oldRef && oldReservation?.data()?.uid === user.uid) transaction.delete(oldRef);
    transaction.set(userRef, {
      displayName: name, displayNameKey: key, username,
      bio,
      photoURL,
      email: user.email ?? "", updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}
export async function initializeUserProfile(user: User) {
  // Existing accounts claim their name on sign-in; collisions get a stable UID suffix.
  let nameAttempt = 0, addressAttempt = 0;
  for (let attempt = 0; attempt < 20; attempt++) {
    try { await writeProfile(user, null, nameAttempt, addressAttempt); return; }
    catch (cause) {
      if (cause instanceof NameTakenError) nameAttempt++;
      else if (cause instanceof UsernameTakenError) addressAttempt++;
      else throw cause;
    }
  }
  throw new Error("사용자 이름을 준비하지 못했어요. 잠시 후 다시 시도해주세요.");
}
export async function saveUserProfile(user: User, draft: ProfileDraft) {
  const normalized = { displayName: normalizeDisplayName(draft.displayName), bio: draft.bio.trim(), ...(draft.username !== undefined ? { username: normalizeUsername(draft.username) } : {}) };
  const errors = validateProfile(normalized);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  await writeProfile(user, normalized);
}
