"use client";

import { initializeUserProfile } from "@/lib/profile-store";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

type UserProfile = { username: string; displayNameKey: string; displayName: string; email: string; photoURL: string; bio: string };
type AuthState = {
  user: User | null; profile: UserProfile | null; loading: boolean;
  profileLoading: boolean; busy: boolean; error: string | null; profileError: string | null;
  login: () => Promise<void>; logout: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);
function message(cause: unknown) {
  const code = (cause as { code?: string })?.code;
  if (code === "auth/popup-blocked") return "팝업이 차단되었어요. 팝업을 허용하고 다시 로그인해주세요.";
  if (code === "auth/unauthorized-domain") return "이 도메인에서는 로그인할 수 없어요. Firebase 인증 도메인 설정을 확인해주세요.";
  if (code === "auth/operation-not-allowed") return "Google 로그인이 활성화되지 않았어요. Firebase 인증 설정을 확인해주세요.";
  return "로그인 상태를 변경하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.";
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const loginAttempt = useRef(0);
  useEffect(() => onAuthStateChanged(auth, (next) => {
    setUser(next); setLoading(false);
    if (next) void initializeUserProfile(next).catch(() => {
      if (auth.currentUser?.uid === next.uid) setError("사용자 정보를 준비하지 못했어요. Firestore 규칙과 연결을 확인해주세요.");
    });
  }, (cause) => { setUser(null); setLoading(false); setError(message(cause)); }), []);

  async function login() {
    if (pending.current) return;
    const attempt = ++loginAttempt.current;
    setError(null);
    // Keep the button available: Firebase can take seconds to report a closed popup.
    // A new popup attempt supersedes the previous request inside the Firebase SDK.
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const { user: signedIn } = await signInWithPopup(auth, provider);
      if (attempt !== loginAttempt.current || auth.currentUser?.uid !== signedIn.uid) return;

    } catch (cause) {
      if (attempt !== loginAttempt.current) return;
      const code = (cause as { code?: string })?.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setError(message(cause));
    }
  }
  async function logout() {
    if (pending.current) return;
    loginAttempt.current++;
    pending.current = true; setBusy(true); setError(null);
    try { await signOut(auth); } catch (cause) { setError(message(cause)); }
    finally { pending.current = false; setBusy(false); }
  }
  return <UserProfileScope key={user?.uid ?? "guest"} user={user} loading={loading} busy={busy} error={error} login={login} logout={logout}>{children}</UserProfileScope>;
}
function UserProfileScope({ children, ...state }: Omit<AuthState, "profile" | "profileLoading" | "profileError"> & { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(!!state.user);
  const [profileError, setProfileError] = useState<string | null>(null);
  const uid = state.user?.uid;
  useEffect(() => {
    if (!uid) return;
    let active = true;
    const unsubscribe = onSnapshot(doc(firestore, "users", uid), (snapshot) => {
      if (!active) return;
      const data = snapshot.data();
      const text = (key: string) => typeof data?.[key] === "string" ? data[key] as string : "";
      setProfile(snapshot.exists() ? { username: text("username"), displayNameKey: text("displayNameKey"), displayName: text("displayName"), email: text("email"), photoURL: text("photoURL"), bio: text("bio") } : null);
      setProfileLoading(false); setProfileError(null);
    }, () => {
      if (!active) return;
      setProfileLoading(false); setProfileError("저장된 사용자 정보를 불러오지 못했어요.");
    });
    return () => { active = false; unsubscribe(); };
  }, [uid]);
  return <AuthContext.Provider value={{ ...state, profile, profileLoading, profileError }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
