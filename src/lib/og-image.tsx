import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
const blue = "#2563eb";
const ink = "#191f28";
const muted = "#4e5968";

type Profile = { username: string; displayName: string; bio: string };

function shorten(text: string, limit: number) {
  const chars = Array.from(text.replace(/\s+/g, " ").trim());
  return chars.length > limit ? chars.slice(0, limit - 1).join("") + "…" : chars.join("");
}

export async function renderOgImage(profile?: Profile) {
  const font = await readFile(join(process.cwd(), "src/app/fonts/Pretendard-SemiBold.woff"));
  const name = profile ? shorten(profile.displayName, 26) : "";
  const bio = profile ? shorten(profile.bio, 72) : "";
  const address = profile ? `/${profile.username}` : "/my-page";

  return new ImageResponse(
    <div style={{
      display: "flex", width: "100%", height: "100%", padding: 52,
      background: "linear-gradient(135deg, #eaf2ff 0%, #f8fbff 55%, #f2efff 100%)",
      color: ink, fontFamily: "Pretendard", fontWeight: 600,
    }}>
      <div style={{
        display: "flex", width: "100%", padding: "42px 46px", alignItems: "center", gap: 40,
        borderRadius: 36, background: "#fff", border: "1px solid #dce7f8",
      }}>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, letterSpacing: "-1px" }}>
            mylink<span style={{ color: blue }}>.</span>
          </div>
          <div style={{
            display: "flex", alignSelf: "flex-start", marginTop: 25, padding: "9px 17px",
            borderRadius: 24, background: "#eaf2ff", color: "#1d4ed8", fontSize: 20,
          }}>{profile ? "마이링크 공개 프로필" : "나만의 링크 모음"}</div>
          {profile ? (
            <div style={{
              display: "flex", marginTop: 16, fontSize: Array.from(name).length > 14 ? 50 : 65,
              lineHeight: 1.13, letterSpacing: "-2px", wordBreak: "break-word",
            }}>{name}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 16, fontSize: 61, lineHeight: 1.12, letterSpacing: "-3px" }}>
              <span>나를 보여주는</span>
              <span style={{ color: blue }}>단 하나의 링크</span>
            </div>
          )}
          <div style={{ display: "flex", marginTop: 16, fontSize: 24, lineHeight: 1.45, color: muted, wordBreak: "break-word" }}>
            {profile ? bio || "나만의 이야기와 링크를 만나보세요." : "작업물부터 SNS까지, 흩어진 링크를 한곳에 모으세요."}
          </div>
          {profile && <div style={{ display: "flex", marginTop: 17, fontSize: 22, color: blue }}>{address}</div>}
        </div>

        <div style={{
          display: "flex", flexDirection: "column", width: 322, flexShrink: 0,
          padding: 24, gap: 15, borderRadius: 28, background: "#f3f7ff", border: "1px solid #e0eafa",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 60, height: 60, flexShrink: 0, borderRadius: 19, color: "#fff", background: blue, fontSize: 30,
            }}>{profile ? Array.from(name)[0] || "M" : "M"}</div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 5 }}>
              <div style={{ display: "flex", fontSize: 23 }}>{profile ? "내 링크 모음" : "나만의 페이지"}</div>
              <div style={{ display: "flex", color: muted, fontSize: 16 }}>{shorten(address, 19)}</div>
            </div>
          </div>
          {(profile ? ["프로필 보기", "링크 둘러보기"] : ["작업물 모아보기", "블로그와 SNS", "내 페이지 공유"]).map((title) => (
            <div key={title} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 16px", borderRadius: 14, background: "#fff", border: "1px solid #e0eafa", fontSize: 20,
            }}>
              <span>{title}</span><span style={{ color: blue }}>↗</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Pretendard", data: font, weight: 600, style: "normal" }] },
  );
}
