import { MAX_SLICES, REST_COLOR, seriesColor } from "@/data/chart";
import { formatBalance } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER, assetValue, round2, sumAssets } from "@/lib/zakat";

/** One wedge of a breakdown: what it is, what it came to, and its colour. */
export type Slice = {
  key: string;
  label: string;
  detail: string;
  value: number;
  color: string;
};

/**
 * The order tokens are given colours in. Fixed for a year regardless of which
 * of them are currently counted, so answering "no" to one holding removes its
 * wedge without repainting the others — a reader who has learned that the green
 * one is SOL should not have that change under them.
 */
export function colourOrder(holdings: Asset[]): string[] {
  return [...holdings]
    .sort((left, right) => assetValue(right) - assetValue(left))
    .map((asset) => asset.mint);
}

/**
 * Each token's share, largest first. Everything past the palette folds into one
 * neutral bucket: a seventh generated hue would be indistinguishable from one
 * of the six under colour-blindness, and the table below carries the detail
 * anyway.
 */
export function byToken(included: Asset[], order: string[]): Slice[] {
  const named: Slice[] = [];
  const rest: Asset[] = [];

  for (const asset of included) {
    const slot = order.indexOf(asset.mint);

    if (slot >= 0 && slot < MAX_SLICES - 1) {
      named.push({
        key: asset.mint,
        label: asset.symbol,
        detail: `${formatBalance(asset.balance, asset.displayDecimals)} ${asset.symbol}`,
        value: round2(assetValue(asset)),
        color: seriesColor(slot),
      });
    } else {
      rest.push(asset);
    }
  }

  named.sort((left, right) => order.indexOf(left.key) - order.indexOf(right.key));

  // One leftover token is worth naming — "Other, 1 token" tells a reader less
  // than the token does, and it costs no extra colour to say it.
  if (rest.length === 1) {
    const [only] = rest;

    named.push({
      key: only.mint,
      label: only.symbol,
      detail: `${formatBalance(only.balance, only.displayDecimals)} ${only.symbol}`,
      value: round2(assetValue(only)),
      color: REST_COLOR,
    });
  } else if (rest.length > 1) {
    named.push({
      key: "rest",
      label: "Other",
      detail: `${rest.length} tokens`,
      value: round2(sumAssets(rest)),
      color: REST_COLOR,
    });
  }

  return named;
}

/**
 * The same wealth grouped by how it is treated rather than by what it is. Takes
 * its colours from the fixed category order, so a category keeps its wedge
 * colour across every year of the report.
 */
export function byCategory(included: Asset[]): Slice[] {
  return CATEGORY_ORDER.flatMap((category, slot) => {
    const matching = included.filter((asset) => asset.category === category);
    if (matching.length === 0) return [];

    return [
      {
        key: category,
        label: CATEGORY_LABELS[category],
        detail: matching.length === 1 ? matching[0].symbol : `${matching.length} tokens`,
        value: round2(sumAssets(matching)),
        color: seriesColor(slot),
      },
    ];
  });
}
