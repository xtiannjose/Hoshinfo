import Image from "next/image";

import type { Shot as ShotData } from "@/content/projects";

export function Shot({
  shot,
  sizes,
  preload = false,
  className = "",
}: {
  shot: ShotData;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const [width, height] = shot.size;
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={width}
      height={height}
      sizes={sizes}
      preload={preload}
      className={`h-auto w-full rounded-xl border border-line bg-surface shadow-[0_12px_40px_-16px_rgb(24_24_27/0.25)] ${className}`}
    />
  );
}
