import { StarIcon } from "@phosphor-icons/react/ssr";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** A link preview image on the Night palette with the Hoshi star: a small label, a title, a line under it and a footer. */
export function ogCard({ label, title, line, footer }: { label: string; title: string; line: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#141b2e",
          color: "#eef0f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, color: "#b9bfd3" }}>
          <StarIcon weight="fill" size={40} color="#e8b74a" />
          {label}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 40, lineHeight: 1.3, color: "#e8b74a" }}>{line}</div>
        </div>
        <div style={{ fontSize: 30, color: "#b9bfd3" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
