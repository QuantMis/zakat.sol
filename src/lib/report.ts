import { LOCAL_CURRENCY } from "@/data/currency";
import type { CsvRow } from "@/lib/export";
import { formatGregorian } from "@/lib/format";
import type { Asset, ZakatYear } from "@/lib/types";
import { ZAKAT_RATE, assetValue, nisabBasisLabel, round2 } from "@/lib/zakat";

/**
 * What the screen currently shows, which is not always what the year arrived
 * as: the hawl answers are the reader's own and are applied on this side, so
 * the export has to be handed them rather than recomputing from the year.
 */
export type YearView = {
  holdings: Asset[];
  counted: (mint: string) => boolean;
  netZakatable: number;
  zakatDue: number;
  aboveNisab: boolean;
};

const SOURCE_LABELS: Record<ZakatYear["source"], string> = {
  live: "Live scan",
  reconstructed: "Rebuilt from chain",
  unpriced: "Could not be priced",
  locked: "Not opened",
};

/**
 * Flat rows for the CSV export — one section per part of the calculation.
 *
 * Every holding is listed, set-aside ones included, with the standing that put
 * them in or out. A row that was excluded still belongs in the file: the point
 * of an export is that someone can check the arithmetic next year, and a
 * missing line is invisible in a way a zero is not.
 *
 * The gold price is carried out with the figures rather than left implicit: a
 * reader checking the sum next year needs the threshold this one was measured
 * against, not the one in force when they open the file.
 */
export function buildYearRows(year: ZakatYear, address: string, view: YearView): CsvRow[] {
  return [
    ["Section", "Item", "Detail", "Amount (USD)"],
    ["Year", "Hijri", year.hijriYear, ""],
    ["Year", "Gregorian", year.gregorianYear, ""],
    ["Year", "Valued", formatGregorian(year.valuedAt), ""],
    ["Year", "Address", address, ""],
    ["Year", "Basis", SOURCE_LABELS[year.source], ""],
    ...view.holdings.map(
      (asset): CsvRow => [
        "Holdings",
        `${asset.name} (${asset.symbol})`,
        view.counted(asset.mint)
          ? `${asset.balance} @ ${asset.price} · zakatable`
          : `${asset.balance} @ ${asset.price} · set aside, not held through the hawl`,
        round2(assetValue(asset)),
      ],
    ),
    ...year.breakdown.map(
      (line): CsvRow => ["Zakatable assets", line.label, line.detail, line.value],
    ),
    ["Total", "Net zakatable", "", view.netZakatable],
    ["Nisab", nisabBasisLabel(year.nisabBasis), "Gold, per gram", year.goldPerGram],
    ["Nisab", "Threshold", view.aboveNisab ? "Above nisab" : "Below nisab", year.nisab],
    ["Total", "Zakat due", `${ZAKAT_RATE * 100}%`, view.zakatDue],
    [
      "Total",
      `Zakat due (${LOCAL_CURRENCY.code})`,
      `at ${LOCAL_CURRENCY.perUsd} per USD`,
      round2(view.zakatDue * LOCAL_CURRENCY.perUsd),
    ],
  ];
}
