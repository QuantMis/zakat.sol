"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { PaywallModal } from "@/components/calculation/paywall-modal";
import { zakatRowGrid } from "@/components/calculation/zakat-grid";
import { AssetTableSkeleton } from "@/components/portfolio/skeleton";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/lock-icon";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { StatCard } from "@/components/ui/stat-card";
import { PREMIUM_PRICE_SOL } from "@/data/premium";
import { CALENDAR } from "@/data/settings";
import { downloadCsv, toCsv } from "@/lib/export";
import { formatDate, formatPrice, formatSol, formatUsd } from "@/lib/format";
import { watchedHref } from "@/lib/navigation";
import { buildYearRows } from "@/lib/report";
import type { ZakatYear } from "@/lib/types";
import { ZAKAT_RATE, nisabBasisLabel } from "@/lib/zakat";
import { usePortfolio } from "@/state/use-portfolio";
import { useYears } from "@/state/use-years";

function TotalRow({
  label,
  detail,
  value,
  strong,
}: {
  label: string;
  detail?: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`${zakatRowGrid} border-t border-line-soft px-5 py-3.5`}>
      <span className={strong ? "text-[14.5px] font-semibold" : "text-[14.5px]"}>{label}</span>
      <span className="hidden text-[11.5px] text-faint md:block">{detail ?? ""}</span>
      <span
        className={`text-right tabular-nums ${strong ? "text-[15px] font-semibold" : "text-[14.5px]"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Breakdown({ year, address }: { year: ZakatYear; address: string }) {
  const exportCsv = () =>
    downloadCsv(`zakat-${year.id}.csv`, toCsv(buildYearRows(year, address)));

  return (
    <Panel className="flex flex-col">
      <PanelHeader className="flex-wrap">
        <h2 className="text-[15px]">What was held</h2>

        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            Download CSV
          </Button>
        </div>
      </PanelHeader>

      <div
        className={`${zakatRowGrid} border-b border-line-soft px-5 py-3 text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Category</div>
        <div className="hidden md:block">Holdings</div>
        <div className="text-right">Value</div>
      </div>

      {year.breakdown.map((line) => (
        <div key={line.label} className={`${zakatRowGrid} border-b border-line-soft px-5 py-3.5`}>
          <span className="truncate text-[14.5px] font-medium">{line.label}</span>
          <span className="hidden truncate text-[11.5px] text-faint md:block">{line.detail}</span>
          <span className="text-right tabular-nums text-[14.5px] font-medium">
            {formatUsd(line.value)}
          </span>
        </div>
      ))}

      <TotalRow label="Net zakatable" value={formatUsd(year.netZakatable)} strong />
      <TotalRow
        label="Nisab"
        detail={`${nisabBasisLabel(year.nisabBasis)} · ${year.aboveNisab ? "above" : "below"}`}
        value={formatUsd(year.nisab)}
      />

      <div className={`${zakatRowGrid} border-t border-line bg-[#F2F6F2] px-5 py-4 text-brand`}>
        <span className="text-[14.5px] font-semibold">Zakat due</span>
        <span className="hidden text-[11.5px] md:block">{ZAKAT_RATE * 100}% of net</span>
        <span className="text-right tabular-nums text-[16px] font-semibold">
          {formatUsd(year.zakatDue)}
        </span>
      </div>
    </Panel>
  );
}

function Missing({ title, detail, back }: { title: string; detail: string; back: string }) {
  return (
    <Panel className="flex flex-col items-center gap-3 px-5 py-16 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      <p className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">{detail}</p>
      <Link href={back} className="text-[13px] text-brand hover:underline">
        Back to all years
      </Link>
    </Panel>
  );
}

/**
 * One year, and what stands behind its figure: the gold price that set the
 * nisab it was measured against, and the holdings it was worked out from.
 */
export function YearDetail({ id }: { id: string }) {
  const watched = useSearchParams().get("address");
  const { status: scan, snapshot } = usePortfolio();
  const { status, years, refresh } = useYears();
  const [paying, setPaying] = useState(false);

  const back = watchedHref("/calculation", watched);
  const year = years.find((candidate) => candidate.id === id);

  if (scan === "idle") {
    return (
      <Missing
        title="Nothing to calculate yet"
        detail="Connect a wallet, or paste an address on the home page to value any wallet."
        back={back}
      />
    );
  }

  if (!year) {
    if (scan === "scanning" || status === "loading") return <AssetTableSkeleton rows={5} />;

    return (
      <Missing
        title="No such year"
        detail="This wallet has no zakat year under that name."
        back={back}
      />
    );
  }

  const label = CALENDAR === "hijri" ? year.hijriYear : year.gregorianYear;
  const priced = year.source !== "unpriced";

  // Reachable by its own URL even though the list will not link to it locked.
  // Nothing is withheld here: the server sent no figures to withhold.
  const locked = year.source === "locked";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link href={back} className="w-fit text-[12px] text-muted hover:text-ink">
            ← All years
          </Link>
          <h2 className="text-[22px] tracking-[-0.02em]">{label}</h2>
          <p className="text-[13px] text-muted">
            Valued {formatDate(year.valuedAt, "gregorian")}
            {year.source === "reconstructed" ? " · rebuilt from chain" : ""}
            {year.source === "live" ? " · scanned just now" : ""}
          </p>
        </div>
      </div>

      {locked ? (
        <Panel className="flex flex-col items-center gap-3 px-5 py-14 text-center">
          <LockIcon className="size-7 text-brand" />
          <p className="text-[15px] font-medium">This year is not open yet</p>
          <p className="max-w-[400px] text-[13.5px] leading-relaxed text-muted">
            Opening {label} rebuilds it from the chain — the holdings at that hawl, the gold price
            behind its nisab, and what was due. One payment opens it and every other earlier year
            for this wallet.
          </p>
          <Button className="mt-1" onClick={() => setPaying(true)}>
            Open for {formatSol(PREMIUM_PRICE_SOL)}
          </Button>
        </Panel>
      ) : priced ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Zakat due" value={formatUsd(year.zakatDue)} tone="brand" />
            <StatCard label="Net zakatable" value={formatUsd(year.netZakatable)} />
            <StatCard
              label="Gold, per gram"
              value={formatPrice(year.goldPerGram)}
              tone={year.source === "reconstructed" ? "muted" : "default"}
            />
          </div>

          <Breakdown year={year} address={snapshot.address} />

          {year.source === "reconstructed" ? (
            <p className="text-[11.5px] leading-relaxed text-faint">
              Rebuilt from the mints this wallet holds today, each read at its balance on{" "}
              {formatDate(year.valuedAt, "gregorian")} and priced at that date. Gold comes from a
              tokenised-gold series rather than the London fix, and unpriced dust is not rebuilt —
              so this is a floor on what was held, not a full ledger.
            </p>
          ) : null}
        </>
      ) : (
        <Missing
          title="This year could not be priced"
          detail="The balances at that hawl are readable, but no price archive covers them, so there is no honest figure to show."
          back={back}
        />
      )}

      {paying ? (
        <PaywallModal
          address={snapshot.address}
          onClose={() => setPaying(false)}
          onOpened={refresh}
        />
      ) : null}
    </div>
  );
}
