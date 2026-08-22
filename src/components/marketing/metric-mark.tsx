import type { ReactElement } from "react";

import { CalculatorIcon } from "@/components/ui/calculator-icon";
import type { Metric } from "@/data/metrics";
import type { MetricTotals } from "@/lib/types";

/**
 * The glyph that leads each row of the hero card. Drawn to match the icons
 * already in the app — 24-unit box, 1.7 stroke, no fill — so the three read as
 * one set with the calculator borrowed from the search field.
 */

function WalletGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M3.5 9.75h17" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.25" cy="14.25" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CoinsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <ellipse cx="12" cy="7" rx="7" ry="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 7v10c0 1.66 3.13 3 7 3s7-1.34 7-3V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const GLYPHS: Record<keyof MetricTotals, (props: { className?: string }) => ReactElement> = {
  wallets: WalletGlyph,
  zakatUsd: CalculatorIcon,
  coins: CoinsGlyph,
};

export function MetricMark({ metric }: { metric: Metric }) {
  const Glyph = GLYPHS[metric.key];

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint text-brand">
      <Glyph className="size-[19px]" />
    </span>
  );
}
