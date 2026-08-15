import type { PricedToken } from "@/lib/types";

/**
 * Jupiter's verified token list, which carries a USD price per mint. One fetch
 * answers both questions a scan asks: is this mint real, and what is it worth.
 *
 * It is also the spam filter, and the reason the app needs one. A scanned
 * wallet is mostly airdropped impersonations — a mint calling itself "$SOL"
 * sitting next to the real thing is routine — and none of them are verified, so
 * none of them are priced. Whatever is missing here becomes dust.
 *
 * Nothing in the request identifies a wallet. It is the same list for everyone,
 * which is the point: the feed that quotes prices never learns whose holdings
 * they are.
 */

const TOKENS_URL = "https://lite-api.jup.ag/tokens/v2/tag?query=verified";

/** The list is ~5 MB, so it is fetched per process rather than per scan. */
const TTL_MS = 5 * 60 * 1000;

type JupiterToken = {
  /** The mint address. */
  id: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  usdPrice?: number;
  icon?: string;
};

let cached: { at: number; tokens: Map<string, PricedToken> } | null = null;
let inflight: Promise<Map<string, PricedToken>> | null = null;

async function load(): Promise<Map<string, PricedToken>> {
  const response = await fetch(TOKENS_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Jupiter returned ${response.status} ${response.statusText}.`);
  }

  const list = (await response.json()) as JupiterToken[];
  const tokens = new Map<string, PricedToken>();

  for (const token of list) {
    // Roughly a third of the list has no live price: a verified mint that has
    // not traded recently is not something we can honestly value.
    if (typeof token.usdPrice !== "number") continue;

    tokens.set(token.id, {
      symbol: token.symbol ?? "",
      name: token.name ?? "",
      usdPrice: token.usdPrice,
      icon: token.icon,
    });
  }

  return tokens;
}

/**
 * The cached list, refreshed once it goes stale. Concurrent scans share a
 * single fetch so a burst cannot pull 5 MB several times over.
 */
export async function pricedTokens(): Promise<Map<string, PricedToken>> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.tokens;

  inflight ??= load()
    .then((tokens) => {
      cached = { at: Date.now(), tokens };
      return tokens;
    })
    .finally(() => {
      inflight = null;
    });

  try {
    return await inflight;
  } catch (error) {
    // A failed refresh should not take down a scan when the list we already
    // hold is only minutes old.
    if (cached) return cached.tokens;

    throw error;
  }
}
