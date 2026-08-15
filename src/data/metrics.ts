/**
 * The counters on the landing page. Nothing about a scan is kept — the only
 * table this app has is `PremiumUnlock` — so there is no aggregate to read
 * these from. They are snapshots, set by hand here and nowhere else.
 */

export type Metric = {
  label: string;
  value: string;
};

export const metrics: Metric[] = [
  { label: "Total Wallet", value: "12,480" },
  { label: "Total Zakat", value: "$3.2M" },
  { label: "Total Coins", value: "640+" },
];
