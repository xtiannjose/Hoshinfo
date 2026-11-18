import { StarIcon } from "@phosphor-icons/react/ssr";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The Hoshi star on the Night palette's ink, readable on light and dark browser tabs.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141b2e",
          borderRadius: 14,
        }}
      >
        <StarIcon weight="fill" size={44} color="#e8b74a" />
      </div>
    ),
    size,
  );
}
