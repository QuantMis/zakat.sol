"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { HoldingsPanel } from "@/components/calculation/holdings-panel";
import { PaywallModal } from "@/components/calculation/paywall-modal";
import { TotalZakat } from "@/components/calculation/total-zakat";
import { ZakatBreakdown } from "@/components/calculation/zakat-breakdown";
import { AssetTableSkeleton } from "@/components/portfolio/skeleton";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/lock-icon";
import { Panel } from "@/components/ui/panel";
import { MAX_SLICES, REST_COLOR, seriesColor } from "@/data/chart";
import { PREMIUM_PRICE_SOL } from "@/data/premium";
import { CALENDAR } from "@/data/settings";
import { byCategory, byToken, colourOrder } from "@/lib/composition";
import { downloadCsv, toCsv } from "@/lib/export";
import { formatDate, formatPrice, formatSol } from "@/lib/format";
import { watchedHref } from "@/lib/navigation";
import { buildYearRows } from "@/lib/report";
import type { ZakatYear } from "@/lib/types";
import { calculateZakat } from "@/lib/zakat";
import { usePortfolio } from "@/state/use-portfolio";
import { useYears } from "@/state/use-years";

/** Past years are rebuilt, so nothing about them is dust. */
const NO_DUST = { mintCount: 0, value: 0 };

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
 * A year that was worked out, with its holdings on the table. The hawl answers
 * live here rather than in a store: they are a reading of one year by one
 * person, and carrying them any further than the screen they were given on
 * would quietly change a figure somewhere else.
 */
function PricedYear({
  year,
  address,
  domain,
}: {
  year: ZakatYear;
  address: string;
  domain?: string;
}) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // A different year, or the same year on a different wallet, is a different
  // set of holdings — answers about the old ones mean nothing against them.
  // Adjusting during render rather than in an effect keeps the panels below
  // from painting once with the stale answers first.
  const scope = `${address}:${year.id}`;
  const [answered, setAnswered] = useState(scope);

  if (answered !== scope) {
    setAnswered(scope);
    setAnswers({});
  }

  const view = useMemo(() => {
    const counted = (mint: string) => answers[mint] !== false;
    const included = year.holdings.filter((asset) => counted(asset.mint));
    const order = colourOrder(year.holdings);

    const result = calculateZakat({
      assets: included,
      dust: NO_DUST,
      nisab: year.nisab,
      solPrice: year.holdings.find((asset) => asset.symbol === "SOL")?.price ?? 0,
    });

    return {
      counted,
      result,
      byToken: byToken(included, order),
      byCategory: byCategory(included),
      colourOf: (mint: string) => {
        const slot = order.indexOf(mint);
        return slot >= 0 && slot < MAX_SLICES - 1 ? seriesColor(slot) : REST_COLOR;
      },
    };
  }, [year, answers]);

  const exportCsv = () =>
    downloadCsv(
      `zakat-${year.id}.csv`,
      toCsv(
        buildYearRows(year, address, {
          holdings: year.holdings,
          counted: view.counted,
          netZakatable: view.result.netZakatable,
          zakatDue: view.result.zakatDue,
          aboveNisab: view.result.aboveNisab,
        }),
      ),
    );

  // Rebuilt to a wallet that held nothing at that hawl — most often because it
  // did not exist yet. There is a figure, it is just zero, so there is nothing
  // to break down and no question to ask about any of it.
  if (year.holdings.length === 0) {
    return (
      <>
        <Panel className="flex flex-col items-center gap-2 px-5 py-14 text-center">
          <p className="text-[15px] font-medium">Nothing was held at this hawl</p>
          <p className="max-w-[400px] text-[13.5px] leading-relaxed text-muted">
            No holding this wallet carries today could be traced back to{" "}
            {formatDate(year.valuedAt, "gregorian")}, so there is nothing for the year to be
            worked out from.
          </p>
        </Panel>

        <TotalZakat zakatDue={0} aboveNisab={false} solPrice={0} />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          Download CSV
        </Button>
      </div>

      <HoldingsPanel
        address={address}
        domain={domain}
        holdings={year.holdings}
        colourOf={view.colourOf}
        heldOf={view.counted}
        onHeldChange={(mint, held) => setAnswers((prev) => ({ ...prev, [mint]: held }))}
      />

      <ZakatBreakdown
        year={year}
        holdings={year.holdings}
        heldOf={view.counted}
        netZakatable={view.result.netZakatable}
        zakatDue={view.result.zakatDue}
        aboveNisab={view.result.aboveNisab}
        byToken={view.byToken}
        byCategory={view.byCategory}
      />

      <TotalZakat
        zakatDue={view.result.zakatDue}
        aboveNisab={view.result.aboveNisab}
        solPrice={year.holdings.find((asset) => asset.symbol === "SOL")?.price ?? 0}
      />
    </>
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
      <div className="flex flex-col gap-1">
        <Link href={back} className="w-fit text-[12px] text-muted hover:text-ink">
          ← All years
        </Link>
        <h2 className="text-[22px] tracking-[-0.02em]">{label}</h2>
        <p className="text-[13px] text-muted">
          Valued {formatDate(year.valuedAt, "gregorian")}
          {year.source === "reconstructed" ? " · rebuilt from chain" : ""}
          {year.source === "live" ? " · scanned just now" : ""}
          {priced && !locked ? ` · gold ${formatPrice(year.goldPerGram)}/g` : ""}
        </p>
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
          <PricedYear year={year} address={snapshot.address} domain={snapshot.domain} />

          <p className="text-[11.5px] leading-relaxed text-faint">
            {year.source === "reconstructed" ? (
              <>
                Rebuilt from the mints this wallet holds today, each read at its balance on{" "}
                {formatDate(year.valuedAt, "gregorian")} and priced at that date. Gold comes from a
                tokenised-gold series rather than the London fix, and unpriced dust is not rebuilt —
                so this is a floor on what was held, not a full ledger.{" "}
              </>
            ) : null}
            Every holding is counted as held through the whole hawl unless you say otherwise. The
            chain can show what was held and when, but not whether the same coins sat there
            throughout, so that answer has to be yours.
          </p>
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
