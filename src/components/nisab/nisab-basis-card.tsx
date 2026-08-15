"use client";

import { RadioCard } from "@/components/ui/radio-card";
import { metalPrices } from "@/data/nisab";
import { formatPrice, formatTime, formatUsd } from "@/lib/format";
import type { NisabBasis } from "@/lib/types";
import { NISAB_GRAMS, nisabThreshold } from "@/lib/zakat";
import { useZakatSettings } from "@/state/zakat-settings";

const bases: Array<{ value: NisabBasis; title: string; pricePerGram: number }> = [
  { value: "gold", title: `Gold · ${NISAB_GRAMS.gold} grams`, pricePerGram: metalPrices.goldPerGram },
  {
    value: "silver",
    title: `Silver · ${NISAB_GRAMS.silver} grams`,
    pricePerGram: metalPrices.silverPerGram,
  },
];

export function NisabBasisCard() {
  const { settings, update } = useZakatSettings();

  return (
    <section className="flex flex-col gap-4 rounded-[14px] border border-line bg-white p-6">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-base">Nisab basis</h2>
        <p className="text-[13px] leading-relaxed text-muted">
          Gold is the stricter threshold; silver captures more wealth.
        </p>
      </header>

      <div role="radiogroup" aria-label="Nisab basis" className="flex flex-col gap-2.5">
        {bases.map((basis) => (
          <RadioCard
            key={basis.value}
            selected={settings.nisabBasis === basis.value}
            onSelect={() => update({ nisabBasis: basis.value })}
            title={basis.title}
            detail={`${formatPrice(basis.pricePerGram)}/g · ${formatUsd(
              nisabThreshold(basis.value, metalPrices),
            )}`}
          />
        ))}
      </div>

      <p className="font-mono text-[11.5px] text-faint">
        Metal prices refresh hourly · last {formatTime(metalPrices.updatedAt)}
      </p>
    </section>
  );
}
