import type { PortfolioSnapshot } from "@/lib/types";

/** Derivations the fixture used to export as constants, now that scans vary. */

export function solPriceOf(snapshot: PortfolioSnapshot): number {
  return snapshot.assets.find((asset) => asset.symbol === "SOL")?.price ?? 0;
}

export function solBalanceOf(snapshot: PortfolioSnapshot): number {
  return snapshot.assets.find((asset) => asset.symbol === "SOL")?.balance ?? 0;
}

/** Total mints held, including the ones no price feed covers. */
export function detectedMintCount(snapshot: PortfolioSnapshot): number {
  return snapshot.assets.length + snapshot.dust.mintCount;
}

/**
 * How to name the wallet on screen: its SNS domain if it has one, otherwise the
 * address, and nothing at all before there is either.
 */
export function walletLabel(snapshot: PortfolioSnapshot): string | null {
  return snapshot.domain ?? (snapshot.address || null);
}
