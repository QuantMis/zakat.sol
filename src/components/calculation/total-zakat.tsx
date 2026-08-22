"use client";

import { Panel } from "@/components/ui/panel";
import { LOCAL_CURRENCY } from "@/data/currency";
import { SHOW_SOL_EQUIVALENT } from "@/data/settings";
import { formatLocal, formatSol, formatUsd } from "@/lib/format";

type TotalZakatProps = {
  zakatDue: number;
  aboveNisab: boolean;
  /** Priced at this year's SOL, so the SOL figure is not today's rate. */
  solPrice: number;
};

/**
 * The figure the page exists to produce, said once more on its own. Local
 * currency leads because that is what gets handed over; the dollar figure sits
 * under it because that is the unit every price behind it was quoted in.
 */
export function TotalZakat({ zakatDue, aboveNisab, solPrice }: TotalZakatProps) {
  return (
    <Panel className="flex flex-col items-center gap-2 px-5 py-9 text-center">
      <span className="text-[11px] tracking-[0.12em] text-faint uppercase">
        Total zakat amount
      </span>

      {aboveNisab ? (
        <>
          {/* Proportional figures — tabular ones read loose at this size. */}
          <span className="text-[40px] leading-tight font-semibold tracking-[-0.03em] text-brand">
            {formatLocal(zakatDue)}
          </span>
          <span className="text-[15px] text-muted">
            {formatUsd(zakatDue)}
            {SHOW_SOL_EQUIVALENT && solPrice > 0 ? ` · ${formatSol(zakatDue / solPrice)}` : ""}
          </span>
          <p className="mt-2 max-w-[420px] text-[11.5px] leading-relaxed text-faint">
            Converted from USD at {LOCAL_CURRENCY.perUsd} {LOCAL_CURRENCY.code} to the dollar.
            The calculation itself is done in USD, which is the unit every price feed behind
            it quotes.
          </p>
        </>
      ) : (
        <>
          <span className="text-[28px] leading-tight font-semibold tracking-[-0.02em]">
            Nothing due
          </span>
          <p className="max-w-[420px] text-[13px] leading-relaxed text-muted">
            What was held sat below nisab at this hawl, so no zakat falls due on it.
          </p>
        </>
      )}
    </Panel>
  );
}
