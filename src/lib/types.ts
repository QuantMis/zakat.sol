export type NisabBasis = "gold" | "silver";

export type CalendarSystem = "hijri" | "gregorian";

/** Drives which treatment rule applies to a holding. */
export type AssetCategory = "sol" | "stablecoin" | "governance" | "memecoin";

export type Asset = {
  mint: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  balance: number;
  price: number;
  /** Decimals to show for the balance — SOL reads better at 3, most tokens at 2. */
  displayDecimals: number;
};

/** Long tail of unpriced mints, reported as a single line. */
export type DustBucket = {
  mintCount: number;
  value: number;
};

export type PortfolioSnapshot = {
  address: string;
  domain: string;
  scannedAt: string;
  assets: Asset[];
  dust: DustBucket;
};

export type Liability = {
  id: string;
  label: string;
  detail: string;
  amount: number;
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

/** Scholarly treatments the owner can switch on or off. */
export type TreatmentRules = {
  includeStablecoinsAtFace: boolean;
  countGovernanceAsTradeGoods: boolean;
  ignoreDust: boolean;
};

export type ZakatSettings = {
  nisabBasis: NisabBasis;
  calendar: CalendarSystem;
  showSolEquivalent: boolean;
  remindBeforeHawl: boolean;
  rules: TreatmentRules;
  /** Mints the owner excluded by hand on the portfolio screen. */
  excludedMints: string[];
  liabilities: Liability[];
};

/**
 * Prose blocks shared by the blog and the privacy policy. Deliberately small —
 * enough structure for the writing we have, without pulling in MDX.
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

export type LegalSection = {
  id: string;
  title: string;
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

export type ZakatYear = {
  id: string;
  hijriYear: string;
  gregorianYear: string;
  calculatedAt: string;
  netWealth: number;
  zakat: number;
  status: "due" | "paid";
};
