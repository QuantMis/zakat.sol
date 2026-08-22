export type NisabBasis = "gold" | "silver";

export type CalendarSystem = "hijri" | "gregorian";

/** Drives which treatment rule applies to a holding. */
export type AssetCategory = "sol" | "stablecoin" | "governance" | "memecoin";

/**
 * A position as the chain reports it, before any price feed is consulted.
 * Becomes an `Asset` once a price and a treatment category are attached.
 */
export type Holding = {
  mint: string;
  symbol: string;
  name: string;
  /** Already scaled out of base units by `decimals`. */
  balance: number;
  /** The mint's own precision, as distinct from how the balance is displayed. */
  decimals: number;
};

export type HoldingsSnapshot = {
  address: string;
  scannedAt: string;
  holdings: Holding[];
};

/** What the price feed knows about a mint, keyed by mint address upstream. */
export type PricedToken = {
  symbol: string;
  name: string;
  usdPrice: number;
  /** Absent for roughly a sixth of verified mints. */
  icon?: string;
};

export type Asset = {
  mint: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  balance: number;
  price: number;
  /** Decimals to show for the balance — SOL reads better at 3, most tokens at 2. */
  displayDecimals: number;
  /** The token's own logo, when the price feed carries one. */
  icon?: string;
};

/** Long tail of unpriced mints, reported as a single line. */
export type DustBucket = {
  mintCount: number;
  value: number;
};

export type PortfolioSnapshot = {
  address: string;
  /** Absent on a live scan until SNS reverse lookup is wired in. */
  domain?: string;
  scannedAt: string;
  assets: Asset[];
  dust: DustBucket;
};

/**
 * The three landing-page counters, as the `WalletTally` table has them.
 * `wallets` counts every scanned wallet and `coins` the distinct mints across
 * all of them, however each one came out; `zakatUsd` is what the ones above the
 * nisab owed. So the band reads as what the calculator has looked at, and what
 * of it was actually due — a wallet under the nisab still counts as read.
 */
export type MetricTotals = {
  wallets: number;
  zakatUsd: number;
  coins: number;
};

/** One row of the calculation: a category, what is in it, and what it came to. */
export type BreakdownLine = {
  label: string;
  detail: string;
  value: number;
};

/**
 * How a year's figures were arrived at, which decides how much they can be
 * leaned on. Reported on screen rather than kept internal — a rebuilt year is
 * an estimate and should never be mistaken for a scan.
 */
export type ZakatYearSource =
  /** Today's scan: every holding priced live. */
  | "live"
  /** Rebuilt from chain: balances read at that date, priced at that date. */
  | "reconstructed"
  /** Balances were readable at that date, but nothing could price them. */
  | "unpriced"
  /** Not paid for, so never rebuilt — the figures do not exist on this side. */
  | "locked";

/**
 * A settled zakat year. Carries the prices it was worked out with — gold moves,
 * and a year re-read against today's gold price is a different, wrong answer.
 */
export type ZakatYear = {
  /** Bare hijri year, "1447" — also the URL segment for its detail page. */
  id: string;
  hijriYear: string;
  gregorianYear: string;
  /** The instant the holdings were valued at. */
  valuedAt: string;
  netZakatable: number;
  zakatDue: number;
  nisab: number;
  nisabBasis: NisabBasis;
  /** The gold price behind that year's nisab, per gram, as it stood then. */
  goldPerGram: number;
  aboveNisab: boolean;
  breakdown: BreakdownLine[];
  /**
   * The positions the year was worked out from, priced as they stood at its
   * hawl. Carried alongside the category rollup rather than instead of it: the
   * screen asks about each token on its own — whether it sat through the whole
   * hawl — which a category line cannot answer. Empty on a year that was never
   * worked out, which is every locked one.
   */
  holdings: Asset[];
  source: ZakatYearSource;
};

export type MetalPrices = {
  goldPerGram: number;
  silverPerGram: number;
  updatedAt: string;
};

export type WalletOption = {
  id: string;
  name: string;
  /** Where to send someone who doesn't have the extension yet. */
  installUrl: string;
};

/**
 * Prose blocks the blog is written in. Deliberately small — enough structure
 * for the writing we have, without pulling in MDX.
 */
export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "note"; title: string; text: string; href?: string; linkLabel?: string };

export type PostTopic = "rulings" | "product" | "guides";

export type Post = {
  slug: string;
  title: string;
  /** Doubles as the card summary and the article lede. */
  excerpt: string;
  topic: PostTopic;
  publishedAt: string;
  body: ContentBlock[];
};

/** A liquid staking token routable through Sanctum. */
export type StakingToken = {
  symbol: string;
  name: string;
  /** Annualised, already net of validator commission. */
  apy: number;
  tvlSol: number;
  note: string;
};

