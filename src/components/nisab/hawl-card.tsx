"use client";

import { Segmented } from "@/components/ui/segmented";
import { Toggle } from "@/components/ui/toggle";
import { hawlAnniversary } from "@/data/nisab";
import { formatGregorian, formatHijri } from "@/lib/format";
import type { CalendarSystem } from "@/lib/types";
import { useZakatSettings } from "@/state/zakat-settings";

const calendars: ReadonlyArray<{ value: CalendarSystem; label: string }> = [
  { value: "hijri", label: "Hijri" },
  { value: "gregorian", label: "Gregorian" },
];

export function HawlCard() {
  const { settings, update } = useZakatSettings();
  const hijri = settings.calendar === "hijri";

  return (
    <section className="flex flex-col gap-4 rounded-[14px] border border-line bg-white p-6">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-base">Hawl anniversary</h2>
        <p className="text-[13px] leading-relaxed text-muted">
          The date your wealth completes a lunar year above nisab.
        </p>
      </header>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[11px] border border-line bg-mint-soft p-4">
          <span className="font-mono text-[15px]">
            {hijri ? formatHijri(hawlAnniversary) : formatGregorian(hawlAnniversary)}
          </span>
          <span className="text-[13px] text-muted">
            ≈ {hijri ? formatGregorian(hawlAnniversary) : formatHijri(hawlAnniversary)}
          </span>
        </div>

        <Segmented
          fill
          options={calendars}
          value={settings.calendar}
          onChange={(calendar) => update({ calendar })}
          label="Calendar"
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <span className="text-[13.5px] text-ink-soft">Remind me two weeks before</span>
        <Toggle
          checked={settings.remindBeforeHawl}
          onChange={(remindBeforeHawl) => update({ remindBeforeHawl })}
          label="Remind me two weeks before the hawl anniversary"
        />
      </div>
    </section>
  );
}
