import type { PortfolioSnapshot } from "@/lib/types";

export type PortfolioStatus =
  /** Nothing to report on yet — no wallet connected and no address given. */
  | "idle"
  | "scanning"
  | "scanned"
  /** The scan failed; the dashboard shows nothing rather than something wrong. */
  | "failed";

export type PortfolioState = {
  status: PortfolioStatus;
  snapshot: PortfolioSnapshot;
  error: string | null;
};

/**
 * What the dashboard reports on before a scan lands. Empty rather than a
 * sample: every figure on these screens is derived from this snapshot, and a
 * plausible number nobody asked for is worse than a blank one.
 */
export const EMPTY_SNAPSHOT: PortfolioSnapshot = {
  address: "",
  scannedAt: "",
  assets: [],
  dust: { mintCount: 0, value: 0 },
};

const idle: PortfolioState = { status: "idle", snapshot: EMPTY_SNAPSHOT, error: null };

/**
 * Kept outside React because the trigger is a wallet event or a URL, not a
 * render, and because every screen in the dashboard reads the same scan.
 *
 * Nothing is persisted, matching the wallet store: a reload re-scans rather
 * than reading a remembered address off disk.
 */
let snapshot: PortfolioState = idle;
let target: string | null = null;

/** Stops a slow scan from overwriting the results of a newer one. */
let latest = 0;

const listeners = new Set<() => void>();

function commit(next: PortfolioState): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

async function scan(address: string): Promise<void> {
  const id = (latest += 1);

  commit({ status: "scanning", snapshot: EMPTY_SNAPSHOT, error: null });

  try {
    const response = await fetch(`/api/portfolio?address=${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error(`Scan failed with ${response.status}.`);

    const scanned = (await response.json()) as PortfolioSnapshot;
    if (id !== latest) return;

    commit({ status: "scanned", snapshot: scanned, error: null });
  } catch {
    if (id !== latest) return;

    commit({
      status: "failed",
      snapshot: EMPTY_SNAPSHOT,
      error: "That address could not be scanned.",
    });
  }
}

/**
 * Points the dashboard at an address, or at nothing. Re-setting the address
 * already on screen is ignored, so a re-render cannot cost a scan.
 */
export function setTarget(address: string | null): void {
  if (address === target) return;
  target = address;

  if (!address) {
    // Invalidates any scan still in flight for the address just dropped.
    latest += 1;
    commit(idle);

    return;
  }

  void scan(address);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): PortfolioState {
  return snapshot;
}

/** The server knows neither the connected wallet nor the scan, so: nothing. */
export function getServerSnapshot(): PortfolioState {
  return idle;
}
