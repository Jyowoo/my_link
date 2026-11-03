import type { Metadata } from "next";
import { ProfileEditor } from "@/components/auth/profile-editor";

export const metadata: Metadata = { title: "프로필 수정 | 마이링크", robots: { index: false, follow: false } };
export default function ProfileSettingsPage() {
  return <ProfileEditor />;
}
