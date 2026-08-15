import type { CsvRow } from "@/lib/export";
import { formatGregorian } from "@/lib/format";
import type { Liability, NisabBasis } from "@/lib/types";
import { ZAKAT_RATE, nisabBasisLabel, type BreakdownLine, type ZakatResult } from "@/lib/zakat";

type ReportInput = {
  result: ZakatResult;
  breakdown: BreakdownLine[];
  liabilities: Liability[];
  nisabBasis: NisabBasis;
  scannedAt: string;
  address: string;
};

/** Flat rows for the CSV export — one section per part of the calculation. */
export function buildReportRows({
  result,
  breakdown,
  liabilities,
  nisabBasis,
  scannedAt,
  address,
}: ReportInput): CsvRow[] {
  return [
    ["Section", "Item", "Detail", "Amount (USD)"],
    ["Scan", "Address", address, ""],
    ["Scan", "Valued at", formatGregorian(scannedAt), ""],
    ...breakdown.map((line): CsvRow => ["Zakatable assets", line.label, line.detail, line.value]),
    ["Total", "Gross holdings", "", result.grossHoldings],
    ...liabilities.map((liability): CsvRow => [
      "Deductions",
      liability.label,
      liability.detail,
      -liability.amount,
    ]),
    ["Deductions", "Excluded tokens", "Left out of the calculation", -result.excludedValue],
    ["Total", "Net zakatable", "", result.netZakatable],
    ["Nisab", nisabBasisLabel(nisabBasis), result.aboveNisab ? "Above nisab" : "Below nisab", result.nisab],
    ["Total", "Zakat due", `${ZAKAT_RATE * 100}%`, result.zakatDue],
  ];
}
