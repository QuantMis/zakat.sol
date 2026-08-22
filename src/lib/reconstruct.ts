import { NISAB_BASIS } from "@/data/settings";
import { priceBook, type PriceBook } from "@/lib/defillama";
import { formatBalance } from "@/lib/format";
import { pastHawls, type Hawl } from "@/lib/hawl";
import { SOL_MINT, balanceAt, nativeBalanceAt } from "@/lib/helius";
import { scanPortfolio } from "@/lib/scan";
import type { Asset, ZakatYear } from "@/lib/types";
import { NISAB_GRAMS, breakdownByCategory, calculateZakat, round2 } from "@/lib/zakat";

/**
 * Rebuilds past zakat years from the chain: what the wallet held at each hawl,
 * priced as it stood then.
 *
 * Two things this cannot know, both of which the screen says out loud rather
 * than papering over:
 *
 *  - The mints are the ones held *today*. A token bought and sold entirely
 *    between two hawls leaves nothing to find, so a rebuilt year is a floor on
 *    what was held, not a ledger of it.
 *  - Dust is not rebuilt. Reading hundreds of unpriced mints per year would
 *    cost more than the line it produces, so past years exclude nothing.
 */

/**
 * Holdings rebuilt per year. Each one costs a balance read per year — the
 * metered half of this — so it bounds what a single rebuild spends; the tail
 * below it is dust-sized in most wallets anyway.
 */
const RECONSTRUCTED_HOLDINGS = 12;

/** Balance reads that may be in flight together against the archive. */
const CONCURRENCY = 8;

/** A rebuild is deterministic and expensive, so the answer is kept for a while. */
const TTL_MS = 60 * 60 * 1000;

const cache = new Map<string, { at: number; years: ZakatYear[] }>();

async function mapLimited<In, Out>(
  items: In[],
  limit: number,
  work: (item: In) => Promise<Out>,
): Promise<Out[]> {
  const results: Out[] = new Array(items.length);
  let next = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await work(items[index]);
    }
  });

  await Promise.all(workers);

  return results;
}

/** Native SOL is read differently from everything else it sits beside. */
function balanceReader(address: string, mint: string, at: Date): Promise<number | null> {
  return mint === SOL_MINT ? nativeBalanceAt(address, at) : balanceAt(address, mint, at);
}

function describe(assets: Asset[]): string {
  if (assets.length === 1) {
    const [asset] = assets;
    return `${asset.symbol} ${formatBalance(asset.balance, asset.displayDecimals)}`;
  }

  return assets.map((asset) => asset.symbol).join(" · ");
}

/** A year whose holdings are readable but whose prices are not. */
function unpriced(hawl: Hawl): ZakatYear {
  return {
    ...hawl,
    netZakatable: 0,
    zakatDue: 0,
    nisab: 0,
    nisabBasis: NISAB_BASIS,
    goldPerGram: 0,
    aboveNisab: false,
    breakdown: [],
    holdings: [],
    source: "unpriced",
  };
}

/**
 * The years an address has, named and dated but not worked out. Returned when
 * nobody has paid for them, which is also why they cost nothing to produce: an
 * unpaid lookup never reaches the archive, so it cannot spend credits either.
 */
export function lockedYears(): ZakatYear[] {
  return pastHawls().map((hawl) => ({
    ...hawl,
    netZakatable: 0,
    zakatDue: 0,
    nisab: 0,
    nisabBasis: NISAB_BASIS,
    goldPerGram: 0,
    aboveNisab: false,
    breakdown: [],
    holdings: [],
    source: "locked",
  }));
}

/**
 * A year the wallet held nothing through — most often because it did not exist
 * yet. Distinct from an unpriced one: nothing owed is an answer, and it keeps
 * the threshold it was measured against.
 */
function empty(hawl: Hawl, goldThen: number): ZakatYear {
  return {
    ...hawl,
    netZakatable: 0,
    zakatDue: 0,
    nisab: round2(NISAB_GRAMS[NISAB_BASIS] * goldThen),
    nisabBasis: NISAB_BASIS,
    goldPerGram: round2(goldThen),
    aboveNisab: false,
    breakdown: [],
    holdings: [],
    source: "reconstructed",
  };
}

async function rebuild(
  address: string,
  hawl: Hawl,
  today: Asset[],
  prices: PriceBook,
): Promise<ZakatYear> {
  const at = new Date(hawl.valuedAt);
  const goldThen = prices.goldPerGram(at);

  // Without the gold price there is no nisab, and without nisab there is no
  // answer to the only question the year is asked.
  if (goldThen === null) return unpriced(hawl);

  const held = await mapLimited(today, CONCURRENCY, async (asset) => {
    const price = prices.of(asset.mint, at);

    // Nothing priced it at that date, so reading the balance would only produce
    // a holding with no value to put against it.
    if (price === null) return null;

    const balance = await balanceReader(address, asset.mint, at);
    if (balance === null || balance <= 0) return null;

    // Everything but the balance and the price is the mint's own description,
    // which does not change with the date.
    return { ...asset, balance, price } satisfies Asset;
  });

  const assets = held.filter((asset): asset is Asset => asset !== null);

  // Held nothing, rather than could not be valued: the wallet was empty at that
  // hawl, or had not been opened yet.
  if (assets.length === 0) return empty(hawl, goldThen);

  const result = calculateZakat({
    assets,
    // Past dust is not rebuilt, so nothing is excluded from a rebuilt year.
    dust: { mintCount: 0, value: 0 },
    nisab: round2(NISAB_GRAMS[NISAB_BASIS] * goldThen),
    solPrice: prices.of(SOL_MINT, at) ?? 0,
  });

  return {
    ...hawl,
    netZakatable: result.netZakatable,
    zakatDue: result.zakatDue,
    nisab: result.nisab,
    nisabBasis: NISAB_BASIS,
    goldPerGram: round2(goldThen),
    aboveNisab: result.aboveNisab,
    breakdown: breakdownByCategory(assets, describe),
    holdings: assets,
    source: "reconstructed",
  };
}

/**
 * The settled years for an address, newest first. The current year is not among
 * them: it comes from the live scan, which knows today exactly.
 */
export async function reconstructYears(address: string): Promise<ZakatYear[]> {
  const cached = cache.get(address);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.years;

  const hawls = pastHawls();
  const snapshot = await scanPortfolio(address);
  const today = snapshot.assets.slice(0, RECONSTRUCTED_HOLDINGS);

  if (today.length === 0) return hawls.map(unpriced);

  // Prices first, in one request: a mint nothing can value at a given hawl is a
  // balance not worth paying to read.
  const prices = await priceBook(
    today.map((asset) => asset.mint),
    hawls.map((hawl) => new Date(hawl.valuedAt)),
  );

  const years: ZakatYear[] = [];
  for (const hawl of hawls) {
    years.push(await rebuild(address, hawl, today, prices));
  }

  cache.set(address, { at: Date.now(), years });

  return years;
}
