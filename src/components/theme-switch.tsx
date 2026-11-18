"use client";

import { StarIcon, SunIcon, TimerIcon } from "@phosphor-icons/react";
import { useLayoutEffect, useSyncExternalStore } from "react";

import { THEME_KEY, type ThemeChoice } from "@/components/theme";

// Auto runs on the clock, hence the stopwatch.
const choices = [
  { value: "auto", label: "Auto", Icon: TimerIcon },
  { value: "day", label: "Day", Icon: SunIcon },
  { value: "night", label: "Night", Icon: StarIcon },
] as const;

/** The <head> script's palette pick (components/theme.ts), run again. */
const repick = () => (window as { hoshinfoTheme?: () => void }).hoshinfoTheme?.();

const listeners = new Set<() => void>();

function read(): ThemeChoice {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "day" || saved === "night" ? saved : "auto";
  } catch {
    return "auto";
  }
}

function choose(choice: ThemeChoice) {
  try {
    if (choice === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // ponytail: with storage blocked a pinned choice lasts until the next minute's clock check; fine for private windows.
  }
  const apply = () => (choice === "auto" ? repick() : (document.documentElement.dataset.theme = choice));
  // Day and Night crossfade where the browser can (reduced motion: at once, see globals.css).
  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Auto follows the clock; Day or Night pins one. Every switch on the page shows the same choice. */
export function ThemeSwitch({ name }: { name: string }) {
  const current = useSyncExternalStore(subscribe, read, () => "auto");
  // In development React's Strict Mode remount clears data-theme from <html>; put it back before paint.
  // A no-op in production.
  useLayoutEffect(() => {
    repick();
  }, []);

  return (
    <fieldset className="inline-flex rounded-full border border-line p-0.5">
      <legend className="sr-only">Colours</legend>
      {choices.map(({ value, label, Icon }) => (
        <label
          key={value}
          title={label}
          className="relative grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-ink has-checked:bg-ink has-checked:text-bg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-star-ink"
        >
          <input
            type="radio"
            name={name}
            value={value}
            checked={current === value}
            onChange={() => choose(value)}
            className="sr-only"
          />
          <Icon className="size-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
