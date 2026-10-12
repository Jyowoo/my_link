export type ProfileLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  actionText: string;
  isExternal: boolean;
  badge: string | null;
  displayOrder: number;
};

export function validateLink(title: string, url: string) {
  const errors: { title?: string; url?: string } = {};
  const length = Array.from(new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(title.trim())).length;
  if (length < 1 || length > 50) errors.title = "제목은 앞뒤 공백을 제외하고 1~50자로 입력해주세요.";
  if (!url.trim() || url.trim().length > 2048) {
    errors.url = "URL은 1~2,048자로 입력해주세요.";
  } else {
    try {
      const parsed = new URL(url.trim());
      if (!/^https?:\/\//i.test(url.trim()) || !["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) {
        errors.url = "http:// 또는 https://로 시작하는 올바른 주소를 입력해주세요.";
      }
    } catch {
      errors.url = "http:// 또는 https://로 시작하는 올바른 주소를 입력해주세요.";
    }
  }
  return errors;
}
