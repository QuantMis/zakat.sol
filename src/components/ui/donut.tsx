"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { Slice } from "@/lib/composition";
import { formatUsd } from "@/lib/format";

/**
 * Part-to-whole at a glance, and only that. A ring is poor at comparing values
 * that sit close together, so every wedge is also named and valued in the
 * legend beside it — and the asset table below the charts carries the same
 * figures in full. Nothing here is readable only by colour.
 */

const SIZE = 168;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CENTRE = SIZE / 2;

/**
 * `pathLength` renormalises the ring to 100 units, so a share can be written
 * straight into the dash array without going through its circumference.
 */
const TRACK = 100;

/** The 2px surface gap between wedges, expressed in those same units. */
const GAP = (2 / (2 * Math.PI * RADIUS)) * TRACK;

/** A wedge thinner than the gap would otherwise vanish into it entirely. */
const MIN_WEDGE = GAP / 2;

function share(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

function formatShare(value: number, total: number): string {
  const percent = share(value, total);

  // Under a tenth of a percent, a rounded figure reads as a flat zero, which is
  // wrong in a way that matters: the holding is there, it is just very small.
  if (percent > 0 && percent < 0.1) return "<0.1%";

  return `${percent.toFixed(1)}%`;
}

type Wedge = { slice: Slice; drawn: number; offset: number };

/**
 * Where each wedge starts and how much of the ring it covers, walked once here
 * so the render below stays a straight map over the result.
 */
function layOut(slices: Slice[], total: number): Wedge[] {
  const wedges: Wedge[] = [];
  let offset = 0;

  for (const slice of slices) {
    const length = share(slice.value, total);

    wedges.push({ slice, drawn: Math.max(length - GAP, MIN_WEDGE), offset });
    offset += length;
  }

  return wedges;
}

function Ring({
  slices,
  total,
  active,
  onHover,
}: {
  slices: Slice[];
  total: number;
  active: string | null;
  onHover: (key: string | null) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="size-[168px] shrink-0"
      role="img"
      aria-label={slices
        .map((slice) => `${slice.label} ${formatShare(slice.value, total)}`)
        .join(", ")}
    >
      <g transform={`rotate(-90 ${CENTRE} ${CENTRE})`}>
        {/* The track behind the wedges, so a part-filled ring still reads as a
            whole and the gaps have something to sit against. */}
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-line-soft"
        />

        {layOut(slices, total).map(({ slice, drawn, offset }) => {
          return (
            <circle
              key={slice.key}
              cx={CENTRE}
              cy={CENTRE}
              r={RADIUS}
              fill="none"
              stroke={slice.color}
              strokeWidth={STROKE}
              pathLength={TRACK}
              strokeDasharray={`${drawn} ${TRACK - drawn}`}
              strokeDashoffset={-offset}
              onMouseEnter={() => onHover(slice.key)}
              onMouseLeave={() => onHover(null)}
              className={cn(
                "transition-opacity",
                active && active !== slice.key ? "opacity-30" : "opacity-100",
              )}
            />
          );
        })}
      </g>
    </svg>
  );
}

type DonutProps = {
  title: string;
  slices: Slice[];
  /** Passed in rather than summed, so the ring measures against the same
      figure the panel headlines — a wedge set that does not fill the ring is
      information, not a rounding artefact. */
  total: number;
  /** What sits in the hole when nothing is hovered. */
  centreLabel: string;
};

export function Donut({ title, slices, total, centreLabel }: DonutProps) {
  const [active, setActive] = useState<string | null>(null);
  const shown = slices.find((slice) => slice.key === active);

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] tracking-[0.12em] text-faint uppercase">{title}</span>

      {slices.length === 0 ? (
        <p className="text-[13px] text-muted">Nothing counted here.</p>
      ) : slices.length === 1 ? (
        // A ring with one wedge is a circle, and a circle carries no comparison.
        // The figure on its own says the same thing without pretending to.
        <div className="flex flex-col gap-1">
          <span className="text-[20px] font-semibold tracking-[-0.02em]">
            {formatUsd(slices[0].value)}
          </span>
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: slices[0].color }}
            />
            All of it is {slices[0].label}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="relative">
            <Ring slices={slices} total={total} active={active} onHover={setActive} />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-6 text-center">
              <span className="text-[17px] font-semibold tracking-[-0.02em]">
                {shown ? formatShare(shown.value, total) : centreLabel}
              </span>
              <span className="line-clamp-2 text-[11px] leading-tight text-muted">
                {shown ? shown.label : `${slices.length} lines`}
              </span>
            </div>
          </div>

          {/* The legend is the chart's readable half: hovering a row lifts its
              wedge, and every figure here is also in the table below. */}
          <ul className="flex min-w-[168px] flex-1 flex-col gap-1.5">
            {slices.map((slice) => (
              <li key={slice.key}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(slice.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(slice.key)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-[7px] px-2 py-1.5 text-left transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                    active === slice.key ? "bg-mint-soft" : "hover:bg-mint-soft",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: slice.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{slice.label}</span>
                  <span className="tabular-nums text-[12.5px] text-muted">
                    {formatShare(slice.value, total)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
