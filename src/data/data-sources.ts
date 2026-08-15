/**
 * The third-party services a scan talks to: balances from one, prices from
 * another, and the archive that values a hawl that closed years ago.
 */

export type DataSource = {
  name: string;
  url: string;
  /** A file in `public/logos`. Without one the row falls back to a monogram. */
  logo?: string;
};

export const dataSources: DataSource[] = [
  { name: "Helius", url: "https://www.helius.dev" },
  { name: "Jupiter", url: "https://jup.ag" },
  { name: "DefiLlama", url: "https://defillama.com" },
  { name: "Phantom", url: "https://phantom.app" },
];
