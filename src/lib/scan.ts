import { categoryFor } from "@/data/categories";
import { fetchHoldings } from "@/lib/helius";
import { pricedTokens } from "@/lib/jupiter";
import type { Asset, PortfolioSnapshot } from "@/lib/types";
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

export async function scanPortfolio(address: string): Promise<PortfolioSnapshot> {
  const [holdings, prices] = await Promise.all([fetchHoldings(address), pricedTokens()]);

  const assets: Asset[] = [];
  let dustMints = 0;
  let dustValue = 0;

  for (const holding of holdings.holdings) {
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
