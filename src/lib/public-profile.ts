import { collection, doc, getDocFromServer, getDocsFromServer, orderBy, query } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { normalizeUsername, validateUsername } from "@/lib/user-profile";
import { validateLink, type ProfileLink } from "@/lib/links";

export async function getPublicProfile(name: string) {
  // This Next.js version can pass URL-encoded dynamic segments to the page.
  let decodedName: string;
  try { decodedName = decodeURIComponent(name); } catch { return null; }
  if (validateUsername(decodedName)) return null;
  const key = normalizeUsername(decodedName);
  const record = await getDocFromServer(doc(firestore, "usernames", key));
  if (!record.exists()) return null;
  const data = record.data();
  // Public documents are projections; never read the private users/{uid} document.
  if (typeof data.uid !== "string" || !data.uid || data.uid.includes("/") || typeof data.displayName !== "string" || data.username !== key) return null;
  const snapshot = await getDocsFromServer(query(collection(firestore, "users", data.uid, "links"), orderBy("displayOrder")));
  const links = snapshot.docs.flatMap((entry) => {
    const link = entry.data();
    if (typeof link.title !== "string" || typeof link.url !== "string" || Object.keys(validateLink(link.title, link.url)).length) return [];
    return [{
      clickCount: typeof link.clickCount === "number" ? link.clickCount : 0,
      id: entry.id, title: link.title, url: link.url,
      description: typeof link.description === "string" ? link.description : "",
      category: typeof link.category === "string" ? link.category : "other",
      icon: typeof link.icon === "string" ? link.icon : "Link2",
      actionText: typeof link.actionText === "string" ? link.actionText : "링크 열기",
      badge: typeof link.badge === "string" ? link.badge : null,
      isExternal: true, displayOrder: typeof link.displayOrder === "number" ? link.displayOrder : 0,
    } satisfies ProfileLink];
  });
  return {
    uid: data.uid, username: key, displayName: data.displayName,
    bio: typeof data.bio === "string" ? data.bio : "",
    photoURL: typeof data.photoURL === "string" && data.photoURL.startsWith("https://") ? data.photoURL : "",
    links,
  };
}
