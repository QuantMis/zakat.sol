"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { LockedValue } from "@/components/calculation/locked-value";
import { PaywallModal } from "@/components/calculation/paywall-modal";
import { yearRowGrid } from "@/components/calculation/zakat-grid";
import { AssetTableSkeleton } from "@/components/portfolio/skeleton";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { CALENDAR } from "@/data/settings";
import { formatDate, formatUsd } from "@/lib/format";
import { watchedHref } from "@/lib/navigation";
import type { ZakatYear } from "@/lib/types";
import { usePortfolio } from "@/state/use-portfolio";
import { useYears } from "@/state/use-years";

/**
 * Shared so a locked row and an open one cannot drift apart. `w-full` matters
 * to the button: a form control sizes to its content even as a grid container,
 * which would resolve its columns against its own width rather than the table's.
 */
const rowStyles =
  "w-full border-b border-line-soft px-5 py-4 text-left transition-colors hover:bg-mint-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand";

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      <p className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

/** What a year's figures rest on, said plainly rather than left to be assumed. */
function SourceNote({ source }: { source: ZakatYear["source"] }) {
  if (source === "live") return <span className="text-[11px] text-brand">Valued now</span>;
  if (source === "unpriced") return <span className="text-[11px] text-faint">Not priced</span>;

  return <span className="text-[11px] text-faint">Rebuilt</span>;
}

type RowProps = {
  year: ZakatYear;
  watched: string | null;
  locked: boolean;
  onUnlock: () => void;
};

/**
 * A locked year is a button rather than a link: there is nothing behind it to
 * open yet, so the row asks for payment instead of leading somewhere that would
 * only ask again.
 */
function YearRow({ year, watched, locked, onUnlock }: RowProps) {
  const label = CALENDAR === "hijri" ? year.hijriYear : year.gregorianYear;
  const priced = year.source !== "unpriced";

  const cells = (
    <>
      <span className="flex flex-col gap-0.5">
        <span className="text-[14.5px] font-semibold">{label}</span>
        <SourceNote source={year.source} />
      </span>

      <span className="hidden text-[12.5px] text-muted md:block">
        {formatDate(year.valuedAt, "gregorian")}
      </span>

      <span className="hidden text-right tabular-nums text-[13.5px] text-ink-soft md:block">
        {locked ? <LockedValue /> : priced ? formatUsd(year.netZakatable) : "—"}
      </span>

      <span className="text-right tabular-nums text-[14.5px] font-medium">
        {locked ? <LockedValue /> : priced ? formatUsd(year.zakatDue) : "—"}
      </span>
    </>
  );

  if (locked) {
    return (
      <button
        type="button"
        onClick={onUnlock}
        aria-label={`Open ${label}`}
        className={`${yearRowGrid} ${rowStyles}`}
      >
        {cells}
      </button>
    );
  }

  return (
    <Link
      href={watchedHref(`/calculation/${year.id}`, watched)}
      className={`${yearRowGrid} ${rowStyles}`}
    >
      {cells}
    </Link>
  );
}

function Years({ watched }: { watched: string | null }) {
  const { status: scan, error: scanError, snapshot } = usePortfolio();
  const { status, years, error, refresh } = useYears();
  const [paying, setPaying] = useState(false);

  // The server decides: a locked year arrives named and dated with no figures
  // in it at all, so there is nothing here to reveal by getting this wrong.
  const anyLocked = years.some((year) => year.source === "locked");

  const total = years.reduce((sum, year) => sum + year.zakatDue, 0);

  return (
    <Panel className="flex flex-1 flex-col">
      <PanelHeader className="flex-wrap">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px]">Zakat years</h2>
          {status === "ready" ? (
            <span className="text-xs text-muted-soft">
              {years.length} years
              {/* Summing them would hand back the figures the rows are hiding. */}
              {anyLocked ? null : ` · ${formatUsd(total)} total`}
            </span>
          ) : null}
        </div>
      </PanelHeader>

      <div
        className={`${yearRowGrid} border-b border-line-soft px-5 py-3 text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Year</div>
        <div className="hidden md:block">Valued</div>
        <div className="hidden text-right md:block">Net zakatable</div>
        <div className="text-right">Zakat due</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {scan === "scanning" ? <AssetTableSkeleton rows={4} /> : null}

        {scan === "idle" ? (
          <EmptyState
            title="Nothing to calculate yet"
            detail="Connect a wallet, or paste an address on the home page to value any wallet."
          />
        ) : null}

        {scan === "failed" ? (
          <EmptyState title="That scan did not complete" detail={scanError ?? ""} />
        ) : null}

        {scan === "scanned" ? (
          <>
            {years.map((year) => (
              <YearRow
                key={year.id}
                year={year}
                watched={watched}
                locked={year.source === "locked"}
                onUnlock={() => setPaying(true)}
              />
            ))}

            {status === "loading" ? <AssetTableSkeleton rows={3} /> : null}

            {status === "failed" ? (
              <p className="px-5 py-4 text-[12.5px] text-muted">{error}</p>
            ) : null}
          </>
        ) : null}
      </div>

      {scan === "scanned" && status === "ready" ? (
        <p className="border-t border-line-soft px-5 py-3 text-[11.5px] leading-relaxed text-faint">
          Earlier years are rebuilt from the mints this wallet holds today, valued at each hawl
          date. Anything disposed of before today leaves nothing to read, so a rebuilt year is a
          floor on what was held rather than a full ledger.
        </p>
      ) : null}

      {paying ? (
        <PaywallModal
          address={snapshot.address}
          onClose={() => setPaying(false)}
          onOpened={refresh}
        />
      ) : null}
    </Panel>
  );
}

/**
 * Zakat is owed per year, so the years are the rows. Each one opens the
 * breakdown behind its figure.
 */
export function YearTable() {
  return (
    <Suspense fallback={<Years watched={null} />}>
      <Watching />
    </Suspense>
  );
}

function Watching() {
  return <Years watched={useSearchParams().get("address")} />;
}
