"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import demoLinks from "@/data/demo-links.json";
import type { ProfileLink } from "@/lib/links";

const LinksContext = createContext<{
  links: ProfileLink[];
  addLink: (draft: Omit<ProfileLink, "id" | "displayOrder">) => void;
} | null>(null);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<ProfileLink[]>(() => [...demoLinks].sort((a, b) => a.displayOrder - b.displayOrder));
  function addLink(draft: Omit<ProfileLink, "id" | "displayOrder">) {
    const id = crypto.randomUUID();
    setLinks((current) => [...current, { ...draft, id, displayOrder: Math.max(0, ...current.map((link) => link.displayOrder)) + 1 }]);
  }
  return <LinksContext.Provider value={{ links, addLink }}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) throw new Error("useLinks must be used inside LinksProvider");
  return context;
}
