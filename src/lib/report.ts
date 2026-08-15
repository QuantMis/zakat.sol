import type { CsvRow } from "@/lib/export";
import { formatGregorian } from "@/lib/format";
import type { ZakatYear } from "@/lib/types";
import { ZAKAT_RATE, nisabBasisLabel } from "@/lib/zakat";

/**
 * Flat rows for the CSV export — one section per part of the calculation.
 *
 * The gold price is carried out with the figures rather than left implicit: a
 * reader checking the sum next year needs the threshold this one was measured
 * against, not the one in force when they open the file.
 */
export function buildYearRows(year: ZakatYear, address: string): CsvRow[] {
  return [
    ["Section", "Item", "Detail", "Amount (USD)"],
    ["Year", "Hijri", year.hijriYear, ""],
    ["Year", "Gregorian", year.gregorianYear, ""],
    ["Year", "Valued", formatGregorian(year.valuedAt), ""],
    ["Year", "Address", address, ""],
    ["Year", "Basis", year.source === "live" ? "Live scan" : "Rebuilt from chain", ""],
    ...year.breakdown.map((line): CsvRow => ["Zakatable assets", line.label, line.detail, line.value]),
    ["Total", "Net zakatable", "", year.netZakatable],
    ["Nisab", nisabBasisLabel(year.nisabBasis), "Gold, per gram", year.goldPerGram],
    ["Nisab", "Threshold", year.aboveNisab ? "Above nisab" : "Below nisab", year.nisab],
    ["Total", "Zakat due", `${ZAKAT_RATE * 100}%`, year.zakatDue],
  ];
}
