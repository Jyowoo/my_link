export function getEmailDisplayName(email: string | null | undefined): string {
  return email?.split("@")[0].trim() || "사용자";
}

export type ProfileDraft = { displayName: string; bio: string };
export function normalizeDisplayName(name: string) {
  return name.normalize("NFKC").trim();
}
export function displayNameKey(name: string) {
  return normalizeDisplayName(name).toLowerCase();
}
export function validateProfile(draft: ProfileDraft) {
  const errors: Partial<Record<keyof ProfileDraft, string>> = {};
  const name = normalizeDisplayName(draft.displayName);
  if (["links", "preview", "settings", "api", "_next", "favicon.ico", "robots.txt", "sitemap.xml", ".", ".."].includes(name.toLowerCase())) errors.displayName = "서비스에서 사용하는 이름이에요. 다른 이름을 입력해주세요.";
  else if (!/^[a-zA-Z0-9가-힣._+-]{2,30}$/.test(name)) errors.displayName = "이름은 2~30자의 한글·영문·숫자·._+-만 사용할 수 있어요.";
  if (Array.from(draft.bio).length > 200) errors.bio = "소개는 200자 이하로 입력해주세요.";
  return errors;
}

export function publicProfilePath(name: string) {
  return "/" + encodeURIComponent(normalizeDisplayName(name));
}
