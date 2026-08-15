"use client";

import { StatCard } from "@/components/ui/stat-card";
import { formatUsd } from "@/lib/format";
import { useZakat } from "@/state/use-zakat";

export function PortfolioStats() {
  const { netZakatable, nisab, aboveNisab } = useZakat();

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Zakatable balance" value={formatUsd(netZakatable)} />
      <StatCard label="Nisab threshold" value={formatUsd(nisab)} tone="muted" />
      <StatCard
        label={aboveNisab ? "Above nisab" : "Below nisab"}
        value={aboveNisab ? "Zakat due" : "Nothing due"}
        tone="brand"
      />
    </div>
  );
}
