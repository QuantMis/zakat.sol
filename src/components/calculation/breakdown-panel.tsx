"use client";

import { Panel, PanelHeader, PanelLabel, PanelRow } from "@/components/ui/panel";
import { formatUsd } from "@/lib/format";
import { useZakat } from "@/state/use-zakat";

export function BreakdownPanel() {
  const { breakdown, grossHoldings } = useZakat();

  return (
    <Panel>
      <PanelHeader>
        <PanelLabel>Zakatable assets</PanelLabel>
      </PanelHeader>

      {breakdown.map((line) => (
        <PanelRow key={line.label}>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[14.5px] font-medium">{line.label}</span>
            <span className="truncate font-mono text-[11.5px] text-faint">{line.detail}</span>
          </div>
          <span className="font-mono text-[15px]">{formatUsd(line.value)}</span>
        </PanelRow>
      ))}

      {breakdown.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">
          Every holding is excluded — nothing is zakatable.
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4 bg-[#F2F6F2] px-5 py-4">
        <span className="text-[14.5px] font-semibold">Gross holdings</span>
        <span className="font-mono text-[15px] font-semibold">{formatUsd(grossHoldings)}</span>
      </div>
    </Panel>
  );
}
