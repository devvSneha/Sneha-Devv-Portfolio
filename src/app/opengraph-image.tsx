import { ImageResponse } from "next/og";
import { site } from "@/data/portfolio";

export const alt = `${site.fullName} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated social share card, served at /opengraph-image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: 80,
          background: "radial-gradient(70% 90% at 10% 0%, rgba(0,120,212,0.45), transparent 60%), radial-gradient(60% 80% at 100% 0%, rgba(78,201,176,0.25), transparent 60%), #1f1f1f",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 30, color: "#6a9955" }}>// hi, I&apos;m</div>
        <div style={{ fontSize: 110, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.fullName}</div>
        <div style={{ fontSize: 44, color: "#4ec9b0" }}>{site.role}</div>
        <div style={{ fontSize: 26, color: "#9d9d9d", marginTop: 20 }}>{site.url.replace(/^https?:\/\//, "")}</div>
      </div>
    ),
    size,
  );
}
