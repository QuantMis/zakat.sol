import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, formatTime, formatUsd } from "@/lib/format";
import type { CalendarSystem, ZakatYear } from "@/lib/types";

const grid =
  "grid grid-cols-[1fr_1fr_110px] items-center gap-3 md:grid-cols-[1fr_1.2fr_1fr_1fr_130px]";

type HistoryTableProps = {
  years: ZakatYear[];
  calendar: CalendarSystem;
};

export function HistoryTable({ years, calendar }: HistoryTableProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-[14px] border border-line bg-white">
      <div
        className={`${grid} border-b border-line-soft px-5 py-3 font-mono text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Year</div>
        <div className="hidden md:block">Calculated</div>
        <div className="hidden text-right md:block">Net wealth</div>
        <div className="text-right">Zakat</div>
        <div className="text-right">Status</div>
      </div>

      {years.map((year) => (
        <div key={year.id} className={`${grid} px-5 py-4 not-last:border-b not-last:border-line-soft`}>
          <div className="text-[15px] font-semibold">
            {calendar === "hijri" ? year.hijriYear : year.gregorianYear}
          </div>
          <div className="hidden font-mono text-[13px] text-muted md:block">
            {formatDate(year.calculatedAt, "gregorian")} · {formatTime(year.calculatedAt)}
          </div>
          <div className="hidden text-right font-mono text-sm text-ink-soft md:block">
            {formatUsd(year.netWealth)}
          </div>
          <div className="text-right font-mono text-[15px] font-medium">
            {formatUsd(year.zakat)}
          </div>
          <div className="flex justify-end">
            <StatusChip status={year.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
