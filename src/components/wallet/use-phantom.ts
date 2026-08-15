"use client";

import { useSyncExternalStore } from "react";

type PhantomWindow = Window & {
  phantom?: { solana?: { isPhantom?: boolean } };
  /** Pre-`window.phantom` injection, still present in older builds. */
  solana?: { isPhantom?: boolean };
};

function detect(): boolean {
  const injected = window as PhantomWindow;
  return Boolean(injected.phantom?.solana?.isPhantom ?? injected.solana?.isPhantom);
}

/**
 * Phantom injects on document load, which can land after hydration, so re-read
 * once the page has settled rather than trusting a single check.
 */
function subscribe(onChange: () => void) {
  const timer = window.setTimeout(onChange, 400);
  window.addEventListener("load", onChange);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("load", onChange);
  };
}

/** Whether the Phantom extension is present; `null` until hydration resolves it. */
export function usePhantomInstalled(): boolean | null {
  return useSyncExternalStore(subscribe, detect, () => null);
}
