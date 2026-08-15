"use client";

import { useCallback, useEffect, useState } from "react";

import { metalPrices } from "@/data/nisab";
import { NISAB_BASIS } from "@/data/settings";
import { toHawl } from "@/lib/hawl";
import type { PortfolioSnapshot, ZakatYear } from "@/lib/types";
import { usePortfolio } from "@/state/use-portfolio";
import { useZakat } from "@/state/use-zakat";

export type YearsStatus = "idle" | "loading" | "ready" | "failed";

export type YearsState = {
  status: YearsStatus;
  /** Newest first, the current year at the top. */
  years: ZakatYear[];
  error: string | null;
  /** Asks again — what a payment changes is on the server, not here. */
  refresh: () => void;
};

/** A rebuild, kept with the address that asked for it so it cannot outlive it. */
type Answer = {
  address: string;
  years: ZakatYear[];
  error: string | null;
};

/**
 * The year in progress, from the scan that just ran. It costs nothing to
 * produce and is exact, which is why it is never rebuilt like the rest.
 */
function liveYear(snapshot: PortfolioSnapshot, zakat: ReturnType<typeof useZakat>): ZakatYear {
  return {
    ...toHawl(snapshot.scannedAt),
    netZakatable: zakat.netZakatable,
    zakatDue: zakat.zakatDue,
    nisab: zakat.nisab,
    nisabBasis: NISAB_BASIS,
    goldPerGram: metalPrices.goldPerGram,
    aboveNisab: zakat.aboveNisab,
    breakdown: zakat.breakdown,
    source: "live",
  };
}

/**
 * Every year this wallet has to answer for. Past ones are rebuilt on the
 * server, which is slow and metered, so they are asked for once per address and
 * only from the screens that show them.
 *
 * Whether a rebuild is still running is derived from the answer on hand rather
 * than recorded: an answer for another address is no answer at all, which is
 * the same condition as never having asked.
 */
export function useYears(): YearsState {
  const { status, snapshot } = usePortfolio();
  const zakat = useZakat();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [asked, setAsked] = useState(0);

  const address = snapshot.address;
  const refresh = useCallback(() => setAsked((count) => count + 1), []);

  useEffect(() => {
    if (!address) return;

    // A rebuild outlives the address that asked for it, so a later answer for
    // an address no longer on screen is dropped rather than shown.
    let current = true;

    fetch(`/api/years?address=${encodeURIComponent(address)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Rebuild failed with ${response.status}.`);

        return (await response.json()) as { years: ZakatYear[] };
      })
      .then(({ years }) => {
        if (current) setAnswer({ address, years, error: null });
      })
      .catch(() => {
        if (current) {
          setAnswer({ address, years: [], error: "Earlier years could not be rebuilt." });
        }
      });

    return () => {
      current = false;
    };
  }, [address, asked]);

  if (status !== "scanned") return { status: "idle", years: [], error: null, refresh };

  const live = liveYear(snapshot, zakat);
  const settled = answer?.address === address ? answer : null;

  // The current year is ready as soon as the scan is, so it is shown while the
  // rest are still being read rather than held back with them.
  if (!settled) return { status: "loading", years: [live], error: null, refresh };

  return {
    status: settled.error ? "failed" : "ready",
    // A rebuilt year landing in the same hijri year as the live one is the same
    // year read twice; the live reading is the better of the two.
    years: [live, ...settled.years.filter((year) => year.id !== live.id)],
    error: settled.error,
    refresh,
  };
}
