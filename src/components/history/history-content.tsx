"use client";

import { HistoryTable } from "@/components/history/history-table";
import { YearChart } from "@/components/history/year-chart";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { downloadCsv, toCsv } from "@/lib/export";
import { formatDate, formatUsd } from "@/lib/format";
import { useZakatHistory } from "@/state/use-zakat";
import { useZakatSettings } from "@/state/zakat-settings";

export function HistoryContent() {
  const { settings } = useZakatSettings();
  const years = useZakatHistory();

  const total = years.reduce((sum, year) => sum + year.zakat, 0);

  const exportAll = () => {
    const rows = [
      ["Year", "Calculated", "Net wealth (USD)", "Zakat (USD)", "Status"],
      ...years.map((year) => [
        settings.calendar === "hijri" ? year.hijriYear : year.gregorianYear,
        formatDate(year.calculatedAt, "gregorian"),
        year.netWealth,
        year.zakat,
        year.status,
      ]),
    ];

    downloadCsv("zakat-history.csv", toCsv(rows));
  };

  return (
    <>
      <PageHeading
        title="History"
        subtitle={`${years.length} years on this wallet · ${formatUsd(total)} total`}
        action={
          <Button variant="outline" size="sm" className="px-4.5 py-2.5 font-medium" onClick={exportAll}>
            Export all
          </Button>
        }
      />

      <YearChart years={years} calendar={settings.calendar} />
      <HistoryTable years={years} calendar={settings.calendar} />
    </>
  );
}
