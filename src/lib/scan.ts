import { categoryFor } from "@/data/categories";
import { fetchHoldings } from "@/lib/helius";
import { pricedTokens } from "@/lib/jupiter";
import type { Asset, Holding, PortfolioSnapshot } from "@/lib/types";
import { DUST_THRESHOLD_USD, assetValue, round2 } from "@/lib/zakat";

/**
 * Joins what the chain says an address holds to what the price feed says those
 * mints are worth. Two providers, deliberately: the one that sees the address
 * is never asked for prices, and the one that quotes prices is never told whose
 * wallet it is.
 */

/** SOL reads better at three decimals; everything else at two. */
function displayDecimals(symbol: string): number {
  return symbol === "SOL" ? 3 : 2;
}

/**
 * One line per mint. Wrapped SOL is not a separate mint from native SOL — both
 * are `So111…112` — so a wallet holding each comes back as two entries against
 * the same thing, at the same price. They are one holding and are added up as
 * one: two rows would double the mint in the list, split what it is worth
 * across them, and give a reader two places to answer the same question about
 * the same coins.
 *
 * Merged before the dust threshold, so two sub-threshold halves of one holding
 * are weighed together rather than each being dropped as dust.
 */
function mergeByMint(holdings: Holding[]): Holding[] {
  const merged = new Map<string, Holding>();

  for (const holding of holdings) {
    const seen = merged.get(holding.mint);

    merged.set(
      holding.mint,
      seen ? { ...seen, balance: seen.balance + holding.balance } : holding,
    );
  }

  return [...merged.values()];
}

export async function scanPortfolio(address: string): Promise<PortfolioSnapshot> {
  const [holdings, prices] = await Promise.all([fetchHoldings(address), pricedTokens()]);

  const assets: Asset[] = [];
  let dustMints = 0;
  let dustValue = 0;

  for (const holding of mergeByMint(holdings.holdings)) {
    const priced = prices.get(holding.mint);

    // Unverified or untraded, so there is no honest number to put against it.
    // It is still something the owner holds, so it is reported, not dropped.
    if (!priced) {
      dustMints += 1;
      continue;
    }

    const asset: Asset = {
      mint: holding.mint,
      // The price feed's naming is the trustworthy one — a mint's own metadata
      // is what an impersonation token controls.
      symbol: priced.symbol || holding.symbol,
      name: priced.name || holding.name,
      category: categoryFor(holding.mint),
      balance: holding.balance,
      price: priced.usdPrice,
      displayDecimals: displayDecimals(priced.symbol || holding.symbol),
      icon: priced.icon,
    };

    // Below the dust line a row costs more attention than it is worth.
    if (assetValue(asset) < DUST_THRESHOLD_USD) {
      dustMints += 1;
      dustValue += assetValue(asset);
      continue;
    }

    assets.push(asset);
  }

  assets.sort((a, b) => assetValue(b) - assetValue(a));

  return {
    address,
    scannedAt: holdings.scannedAt,
    assets,
    dust: { mintCount: dustMints, value: round2(dustValue) },
  };
}
