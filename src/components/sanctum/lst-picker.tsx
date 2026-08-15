"use client";

import { cn } from "@/lib/cn";
import { formatBalance, formatPercent } from "@/lib/format";
import type { StakingToken } from "@/lib/types";

type LstPickerProps = {
  tokens: StakingToken[];
  value: string;
  onChange: (symbol: string) => void;
};

export function LstPicker({ tokens, value, onChange }: LstPickerProps) {
  return (
    <div role="radiogroup" aria-label="Liquid staking token" className="flex flex-col">
      {tokens.map((token) => {
        const selected = token.symbol === value;

        return (
          <button
            key={token.symbol}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(token.symbol)}
            className={cn(
              "flex items-center gap-4 px-5 py-4 text-left transition-colors not-last:border-b not-last:border-line-soft",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand",
              selected ? "bg-mint-soft" : "hover:bg-ink/[0.02]",
            )}
          >
            <span
              className={cn(
                "size-[18px] shrink-0 rounded-full border-2 transition-all",
                selected ? "border-[5px] border-brand bg-white" : "border-[#A9B3AB]",
              )}
            />

            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="text-[14.5px] font-semibold">{token.symbol}</span>
                <span className="font-mono text-[11.5px] text-faint">{token.name}</span>
              </span>
              <span className="truncate text-[12.5px] text-muted">{token.note}</span>
            </span>

            <span className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="font-mono text-[14.5px] font-semibold text-brand">
                {formatPercent(token.apy)}
              </span>
              <span className="font-mono text-[11px] text-faint">
                {formatBalance(token.tvlSol, 0)} SOL
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
