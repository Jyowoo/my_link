"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { addDoc, updateDoc, deleteDoc, doc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { auth, firestore } from "@/lib/firebase";
import type { ProfileLink } from "@/lib/links";

const LinksContext = createContext<{
  links: ProfileLink[];
  loading: boolean;
  error: string | null;
  updateLink: (id: string, draft: Omit<ProfileLink, "id" | "displayOrder">) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  addLink: (draft: Omit<ProfileLink, "id" | "displayOrder">) => Promise<void>;
} | null>(null);

export function LinksProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (!user || loading) {
    const requireLogin = async () => { throw new Error("로그인 후 사용할 수 있어요."); };
    return <LinksContext.Provider value={{ links: [], loading, error: null, addLink: requireLogin, updateLink: requireLogin, deleteLink: requireLogin }}>{children}</LinksContext.Provider>;
  }
  return <UserLinksProvider key={user.uid} uid={user.uid}>{children}</UserLinksProvider>;
}

function UserLinksProvider({ uid, children }: { uid: string; children: ReactNode }) {
  function requireOwner() {
    if (auth.currentUser?.uid !== uid) throw new Error("로그인 상태가 변경되었어요. 다시 시도해주세요.");
  }
  const pendingDeletes = useRef(new Set<string>());
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const linksQuery = query(collection(firestore, "users", uid, "links"), orderBy("displayOrder"));
    const unsubscribe = onSnapshot(linksQuery, { includeMetadataChanges: true }, (snapshot) => {
      if (!active || snapshot.metadata.hasPendingWrites) return;
      const received = snapshot.docs.map((document) => ({ ...document.data(), id: document.id } as ProfileLink));
      // A local delete can remove a document from a query before the server acknowledges it.
      setLinks((current) => [...received, ...current.filter((link) => pendingDeletes.current.has(link.id) && !received.some((next) => next.id === link.id))]
        .sort((a, b) => a.displayOrder - b.displayOrder));
      setLoading(false);
      setError(null);
    }, (cause) => {
      if (!active) return;
      console.error("Failed to load links:", cause);
      setLoading(false);
      setError("링크를 불러오지 못했어요. 잠시 후 새로고침해주세요.");
    });
    return () => { active = false; unsubscribe(); };
  }, [uid]);

  async function addLink(draft: Omit<ProfileLink, "id" | "displayOrder">) {
    requireOwner();
    await addDoc(collection(firestore, "users", uid, "links"), {
      ...draft,
      displayOrder: Math.max(0, ...links.map((link) => link.displayOrder)) + 1,
      createdAt: serverTimestamp(),
    });
  }
  async function updateLink(id: string, draft: Omit<ProfileLink, "id" | "displayOrder">) {
    requireOwner();
    await updateDoc(doc(firestore, "users", uid, "links", id), { ...draft, updatedAt: serverTimestamp() });
  }

  async function deleteLink(id: string) {
    requireOwner();
    pendingDeletes.current.add(id);
    try {
      await deleteDoc(doc(firestore, "users", uid, "links", id));
      setLinks((current) => current.filter((link) => link.id !== id));
    } finally {
      pendingDeletes.current.delete(id);
    }
  }

  return <LinksContext.Provider value={{ links, loading, error, addLink, updateLink, deleteLink }}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) throw new Error("useLinks must be used inside LinksProvider");
  return context;
}
