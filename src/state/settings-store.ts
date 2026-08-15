import { seedLiabilities } from "@/data/nisab";
import type { Liability, TreatmentRules, ZakatSettings } from "@/lib/types";

/** Exported so the privacy page can name the exact key it tells you about. */
export const STORAGE_KEY = "zakat.sol:settings";

export const defaultSettings: ZakatSettings = {
  nisabBasis: "gold",
  calendar: "hijri",
  showSolEquivalent: true,
  remindBeforeHawl: true,
  rules: {
    includeStablecoinsAtFace: true,
    countGovernanceAsTradeGoods: true,
    ignoreDust: true,
  },
  excludedMints: [],
  liabilities: seedLiabilities,
};

function readStored(): ZakatSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;

    const parsed = JSON.parse(raw) as Partial<ZakatSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      rules: { ...defaultSettings.rules, ...parsed.rules },
    };
  } catch {
    return defaultSettings;
  }
}

/**
 * Settings live outside React so they can be read synchronously during
 * hydration: the server snapshot is always the defaults, and React swaps in
 * the stored snapshot once the client takes over.
 */
let snapshot: ZakatSettings =
  typeof window === "undefined" ? defaultSettings : readStored();

const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): ZakatSettings {
  return snapshot;
}

export function getServerSnapshot(): ZakatSettings {
  return defaultSettings;
}

function commit(next: ZakatSettings): void {
  snapshot = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode, quota) — state still applies.
  }

  for (const listener of listeners) listener();
}

/** Drops the stored settings entirely rather than writing defaults over them. */
export function reset(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, quota) — state still applies.
  }

  snapshot = defaultSettings;
  for (const listener of listeners) listener();
}

export function update(patch: Partial<ZakatSettings>): void {
  commit({ ...snapshot, ...patch });
}

export function setRule(rule: keyof TreatmentRules, value: boolean): void {
  commit({ ...snapshot, rules: { ...snapshot.rules, [rule]: value } });
}

export function toggleAsset(mint: string): void {
  const { excludedMints } = snapshot;

  commit({
    ...snapshot,
    excludedMints: excludedMints.includes(mint)
      ? excludedMints.filter((excluded) => excluded !== mint)
      : [...excludedMints, mint],
  });
}

export function addLiability(liability: Omit<Liability, "id">): void {
  commit({
    ...snapshot,
    liabilities: [
      ...snapshot.liabilities,
      { ...liability, id: `liability-${snapshot.liabilities.length + 1}` },
    ],
  });
}

export function removeLiability(id: string): void {
  commit({
    ...snapshot,
    liabilities: snapshot.liabilities.filter((liability) => liability.id !== id),
  });
}
