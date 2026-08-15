/**
 * Historical prices, which the live feeds cannot answer. Jupiter quotes spot
 * and nothing else, so a past hawl has to be valued somewhere with an archive.
 *
 * DefiLlama keys its archive by `chain:address`, which is the same thing a scan
 * already knows a holding by — no symbol mapping, no listing to look up, and no
 * key to hold. One request covers every mint at every hawl at once.
 *
 * Nothing in that request identifies a wallet: it is a list of mints and dates,
 * which is the same promise the live price feed makes.
 */

const API_URL = "https://coins.llama.fi";

/**
 * Gold is priced through Paxos Gold, one token to the ounce and redeemable for
 * it. Not the London fix — it carries the premium the token trades at — but it
 * puts the nisab threshold on the same archive as everything else, and it
 * tracks: $1,956/oz at the 1444 hawl, $2,886 at 1446.
 */
const GOLD_COIN = "ethereum:0x45804880De22913dAFE09f4980848ECE6EcbAf78";

/** Grams in a troy ounce, which is the unit gold is quoted in. */
const GRAMS_PER_TROY_OUNCE = 31.1034768;

/**
 * DefiLlama scores how sure it is of a price. A thin or stale market scores
 * low, and a number nobody is confident in is worse than no number.
 */
const MIN_CONFIDENCE = 0.5;

/** Prices resolve to the nearest trade, which for a dead mint can be far off. */
const MAX_DRIFT_MS = 3 * 86_400_000;

/** Deterministic once the dates are in the past, so worth holding on to. */
const TTL_MS = 60 * 60 * 1000;

type Point = { timestamp: number; price: number; confidence?: number };

type BatchResponse = { coins?: Record<string, { prices?: Point[] }> };

const cache = new Map<string, { at: number; book: Map<string, Point[]> }>();

function coinKey(mint: string): string {
  return `solana:${mint}`;
}

/**
 * The price nearest the moment asked about, or null when the archive does not
 * reach it — a token that had not launched by that hawl has no price then, and
 * inventing one would put wealth in a wallet that never held it.
 */
function priceAt(points: Point[], at: Date): number | null {
  let closest: Point | null = null;

  for (const point of points) {
    const distance = Math.abs(point.timestamp * 1000 - at.getTime());
    if (!closest || distance < Math.abs(closest.timestamp * 1000 - at.getTime())) closest = point;
  }

  if (!closest) return null;
  if (Math.abs(closest.timestamp * 1000 - at.getTime()) > MAX_DRIFT_MS) return null;
  if ((closest.confidence ?? 1) < MIN_CONFIDENCE) return null;

  return closest.price;
}

/** What each holding, and gold, was worth at each hawl. */
export type PriceBook = {
  of: (mint: string, at: Date) => number | null;
  goldPerGram: (at: Date) => number | null;
};

/**
 * One request for every mint at every date. Mints the archive does not carry
 * come back absent rather than failing the batch, and become unpriced holdings.
 */
export async function priceBook(mints: string[], dates: Date[]): Promise<PriceBook> {
  const seconds = dates.map((date) => Math.floor(date.getTime() / 1000));
  const coins = Object.fromEntries([
    ...mints.map((mint) => [coinKey(mint), seconds]),
    [GOLD_COIN, seconds],
  ]);

  const query = JSON.stringify(coins);
  const cached = cache.get(query);
  const book = cached && Date.now() - cached.at < TTL_MS ? cached.book : await load(query);

  return {
    of: (mint, at) => priceAt(book.get(coinKey(mint)) ?? [], at),
    goldPerGram: (at) => {
      const perOunce = priceAt(book.get(GOLD_COIN) ?? [], at);

      return perOunce === null ? null : perOunce / GRAMS_PER_TROY_OUNCE;
    },
  };
}

async function load(query: string): Promise<Map<string, Point[]>> {
  const response = await fetch(`${API_URL}/batchHistorical?coins=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`DefiLlama returned ${response.status} ${response.statusText}.`);
  }

  const payload = (await response.json()) as BatchResponse;
  const book = new Map<string, Point[]>();

  for (const [coin, series] of Object.entries(payload.coins ?? {})) {
    book.set(coin, series.prices ?? []);
  }

  cache.set(query, { at: Date.now(), book });

  return book;
}
