"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { ProfileLink } from "@/lib/links";

const LinksContext = createContext<{
  links: ProfileLink[];
  loading: boolean;
  error: string | null;
  addLink: (draft: Omit<ProfileLink, "id" | "displayOrder">) => Promise<void>;
} | null>(null);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const linksQuery = query(collection(firestore, "users", "anonymous", "links"), orderBy("displayOrder"));
    return onSnapshot(linksQuery, { includeMetadataChanges: true }, (snapshot) => {
      setLinks(snapshot.docs.filter((document) => !document.metadata.hasPendingWrites).map((document) => ({
        ...document.data(), id: document.id,
      } as ProfileLink)));
      setLoading(false);
      setError(null);
    }, (cause) => {
      console.error("Failed to load links:", cause);
      setLoading(false);
      setError("링크를 불러오지 못했어요. 잠시 후 새로고침해주세요.");
    });
  }, []);

  async function addLink(draft: Omit<ProfileLink, "id" | "displayOrder">) {
    await addDoc(collection(firestore, "users", "anonymous", "links"), {
      ...draft,
      displayOrder: Math.max(0, ...links.map((link) => link.displayOrder)) + 1,
      createdAt: serverTimestamp(),
    });
  }
  return <LinksContext.Provider value={{ links, loading, error, addLink }}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) throw new Error("useLinks must be used inside LinksProvider");
  return context;
}
