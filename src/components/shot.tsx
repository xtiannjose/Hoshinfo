import Image from "next/image";

import type { Shot as ShotData } from "@/content";

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

/** A phone screen mounted in the bottom-right corner of a desktop screenshot, so both stay in view. */
export function PhoneInset({ shot }: { shot: ShotData }) {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 w-[17%] max-w-36 rounded-[10px] border border-line bg-surface p-0.5 shadow-[0_16px_32px_-12px_rgb(0_0_0/0.45)] sm:bottom-4 sm:right-4">
      <Shot shot={shot} bare sizes="150px" />
    </div>
  );
}
