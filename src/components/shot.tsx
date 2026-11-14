import Image from "next/image";

import type { Shot as ShotData } from "@/content/projects";

export function Shot({
  shot,
  sizes,
  preload = false,
  bare = false,
  className = "",
}: {
  shot: ShotData;
  sizes: string;
  preload?: boolean;
  /** For a picture mounted inside a frame: 8px corners (the frame's 12 minus its 4px rim), no border or shadow. */
  bare?: boolean;
  className?: string;
}) {
  const [width, height] = shot.size;
  const look = bare
    ? "rounded-lg"
    : "rounded-xl border border-line shadow-[0_12px_40px_-16px_rgb(24_24_27/0.25)]";
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={width}
      height={height}
      sizes={sizes}
      preload={preload}
      className={`h-auto w-full bg-surface ${look} ${className}`}
    />
  );
}
