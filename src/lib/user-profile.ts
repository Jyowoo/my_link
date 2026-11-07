export function getEmailDisplayName(email: string | null | undefined): string {
  return email?.split("@")[0].trim() || "사용자";
}

export type ProfileDraft = { displayName: string; bio: string; username?: string };
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
  if (draft.username !== undefined) { const error = validateUsername(draft.username); if (error) errors.username = error; }
  return errors;
}

export function publicProfilePath(name: string) {
  return "/" + encodeURIComponent(normalizeUsername(name));
}

export function normalizeUsername(username: string) { return username.normalize("NFKC").trim().toLowerCase(); }
export function validateUsername(username: string): string | undefined {
  const value = normalizeUsername(username);
  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(value)) return "주소 아이디는 영문·숫자로 시작하는 3~30자의 영문·숫자·밑줄·하이픈으로 입력해주세요.";
  if (["links", "preview", "settings", "api", "_next"].includes(value)) return "서비스에서 사용하는 주소예요. 다른 아이디를 입력해주세요.";
}
