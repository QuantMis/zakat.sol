import { formatUsd } from "@/lib/format";
import type { CalendarSystem, ZakatYear } from "@/lib/types";

/** Bars are scaled against the biggest year, capped so labels always fit. */
const MAX_BAR_HEIGHT = 70;

type YearChartProps = {
  years: ZakatYear[];
  calendar: CalendarSystem;
};

export function YearChart({ years, calendar }: YearChartProps) {
  const ordered = [...years].reverse();
  const peak = Math.max(...ordered.map((year) => year.zakat), 1);

  return (
    <div className="flex h-[210px] items-end gap-6 rounded-[14px] border border-line bg-white px-7 py-6">
      {ordered.map((year) => (
        <div key={year.id} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
          <span className="font-mono text-sm">{formatUsd(year.zakat)}</span>
          <span
            className="w-full rounded-t-lg"
            style={{
              height: `${(year.zakat / peak) * MAX_BAR_HEIGHT}%`,
              background: year.status === "due" ? "var(--color-brand)" : "#D5E7DB",
            }}
          />
          <span className="font-mono text-xs text-muted-soft">
            {calendar === "hijri" ? year.hijriYear : year.gregorianYear}
          </span>
        </div>
      ))}
    </div>
  );
}
