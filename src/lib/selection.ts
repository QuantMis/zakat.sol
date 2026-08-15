import type { Asset, ZakatSettings } from "@/lib/types";
import { DUST_THRESHOLD_USD, assetValue } from "@/lib/zakat";

/**
 * A holding counts towards zakat unless the owner excluded it by hand or a
 * treatment rule takes it out.
 */
export function isAssetIncluded(asset: Asset, settings: ZakatSettings): boolean {
  if (settings.excludedMints.includes(asset.mint)) return false;
  if (asset.category === "stablecoin" && !settings.rules.includeStablecoinsAtFace) return false;
  if (asset.category === "governance" && !settings.rules.countGovernanceAsTradeGoods) return false;
  if (settings.rules.ignoreDust && assetValue(asset) < DUST_THRESHOLD_USD) return false;

  return true;
}

export function partitionAssets(assets: Asset[], settings: ZakatSettings) {
  const included: Asset[] = [];
  const excluded: Asset[] = [];

  for (const asset of assets) {
    (isAssetIncluded(asset, settings) ? included : excluded).push(asset);
  }

  return { included, excluded };
}

/** Unpriced mints only join the total when the dust rule is switched off. */
export function includesDust(settings: ZakatSettings): boolean {
  return !settings.rules.ignoreDust;
}
