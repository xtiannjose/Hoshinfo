import { StarIcon } from "@phosphor-icons/react/ssr";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The Hoshi star on the dark ink, readable on light and dark browser tabs.
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
          background: "#18181b",
          borderRadius: 14,
        }}
      >
        <StarIcon weight="fill" size={44} color="#f2b53a" />
      </div>
    ),
    size,
  );
}
