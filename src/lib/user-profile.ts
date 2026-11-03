export function getEmailDisplayName(email: string | null | undefined): string {
  return email?.split("@")[0].trim() || "사용자";
}
