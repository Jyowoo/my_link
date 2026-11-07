import { pageMetadata } from "@/lib/seo";
import { ProfileEditor } from "@/components/auth/profile-editor";

export const metadata = pageMetadata({
  title: "프로필 수정 | 마이링크",
  description: "내 마이링크의 표시 이름, 소개, 공개 페이지 주소를 수정하세요.",
});
export default function ProfileSettingsPage() {
  return <ProfileEditor />;
}
