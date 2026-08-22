import type { MetricTotals } from "@/lib/types";

/**
 * The counters on the landing page. The figures themselves are not here — they
 * are read off the `WalletTally` table and pushed as they move, so this is only
 * what each one is called and how it should read.
 */

export type Metric = {
  /** Which figure on the totals this card shows. */
  key: keyof MetricTotals;
  label: string;
  /** Counts read as plain integers; the zakat figure is compacted money. */
  kind: "count" | "usd";
};

export const metrics: Metric[] = [
  { key: "wallets", label: "Total Wallet", kind: "count" },
  { key: "zakatUsd", label: "Total Zakat", kind: "usd" },
  { key: "coins", label: "Total Coins", kind: "count" },
];
