"use client";

import { Button } from "@/components/ui/button";
import { portfolio, solPrice } from "@/data/portfolio";
import { downloadCsv, toCsv } from "@/lib/export";
import { formatSol, formatUsd, formatYear } from "@/lib/format";
import { buildReportRows } from "@/lib/report";
import { ZAKAT_RATE, nisabBasisLabel } from "@/lib/zakat";
import { useZakat } from "@/state/use-zakat";
import { useZakatSettings } from "@/state/zakat-settings";

export function ZakatSummaryCard() {
  const { settings } = useZakatSettings();
  const zakat = useZakat();

  const exportCsv = () => {
    const rows = buildReportRows({
      result: zakat,
      breakdown: zakat.breakdown,
      liabilities: settings.liabilities,
      nisabBasis: settings.nisabBasis,
      scannedAt: portfolio.scannedAt,
      address: portfolio.address,
    });

    downloadCsv(
      `zakat-${formatYear(portfolio.scannedAt, settings.calendar).replace(/\s+/g, "-")}.csv`,
      toCsv(rows),
    );
  };

  return (
    <div className="flex flex-col gap-4.5 rounded-[16px] border border-brand/28 bg-linear-165 from-brand-mid to-brand-deep p-6.5 text-white">
      <span className="font-mono text-[11px] tracking-[0.14em] text-brand-pale uppercase">
        Zakat due · {ZAKAT_RATE * 100}%
      </span>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[40px] font-semibold tracking-[-0.03em] lg:text-[46px]">
          {formatUsd(zakat.zakatDue)}
        </span>
        <span className="font-mono text-sm text-white/78">
          {settings.showSolEquivalent
            ? `≈ ${formatSol(zakat.zakatDueInSol)} at ${formatUsd(solPrice)}`
            : "Valued in USD at scan time"}
        </span>
      </div>

      <span className="h-px bg-ink/13" aria-hidden />

      <dl className="flex flex-col gap-2.5 text-[13.5px]">
        <div className="flex justify-between gap-4">
          <dt className="text-white/78">Net zakatable</dt>
          <dd className="font-mono">{formatUsd(zakat.netZakatable)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/78">Nisab ({nisabBasisLabel(settings.nisabBasis)})</dt>
          <dd className="font-mono">{formatUsd(zakat.nisab)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/78">Status</dt>
          <dd className="font-semibold">{zakat.aboveNisab ? "Above nisab" : "Below nisab"}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2.5 print:hidden">
        <Button variant="light" onClick={() => window.print()}>
          Export report (PDF)
        </Button>
        <Button
          variant="outline"
          onClick={exportCsv}
          className="border-ink/18 font-medium text-white hover:bg-white/10"
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
}
