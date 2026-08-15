"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Panel, PanelHeader, PanelLabel, PanelRow } from "@/components/ui/panel";
import { portfolio } from "@/data/portfolio";
import { formatSigned } from "@/lib/format";
import { useZakat } from "@/state/use-zakat";
import { useZakatSettings } from "@/state/zakat-settings";

export function DeductionsPanel() {
  const { settings, addLiability, removeLiability } = useZakatSettings();
  const { excludedAssets, excludedValue, includeDust } = useZakat();
  const [isAdding, setIsAdding] = useState(false);

  const excludedMintCount = excludedAssets.length + (includeDust ? 0 : portfolio.dust.mintCount);

  return (
    <Panel>
      <PanelHeader>
        <PanelLabel>Deductions</PanelLabel>
        <button
          type="button"
          onClick={() => setIsAdding((adding) => !adding)}
          className="text-[12.5px] text-brand transition-colors hover:text-brand-bright"
        >
          {isAdding ? "Cancel" : "+ Add liability"}
        </button>
      </PanelHeader>

      {isAdding ? <AddLiabilityForm onAdd={addLiability} onDone={() => setIsAdding(false)} /> : null}

      {settings.liabilities.map((liability) => (
        <PanelRow key={liability.id}>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[14.5px] font-medium">{liability.label}</span>
            <span className="truncate font-mono text-[11.5px] text-faint">{liability.detail}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[15px] text-danger">
              {formatSigned(-liability.amount)}
            </span>
            <button
              type="button"
              onClick={() => removeLiability(liability.id)}
              aria-label={`Remove ${liability.label}`}
              className="text-xs text-faint transition-colors hover:text-danger"
            >
              ✕
            </button>
          </div>
        </PanelRow>
      ))}

      {excludedValue > 0 ? (
        <PanelRow>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[14.5px] font-medium">Excluded tokens</span>
            <span className="truncate font-mono text-[11.5px] text-faint">
              {excludedMintCount} {excludedMintCount === 1 ? "mint" : "mints"} left out
            </span>
          </div>
          <span className="font-mono text-[15px] text-danger">{formatSigned(-excludedValue)}</span>
        </PanelRow>
      ) : null}

      {settings.liabilities.length === 0 && excludedValue === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No deductions.</p>
      ) : null}
    </Panel>
  );
}

type AddLiabilityFormProps = {
  onAdd: (liability: { label: string; detail: string; amount: number }) => void;
  onDone: () => void;
};

function AddLiabilityForm({ onAdd, onDone }: AddLiabilityFormProps) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const submit = () => {
    const parsed = Number(amount);
    if (!label.trim() || !Number.isFinite(parsed) || parsed <= 0) return;

    onAdd({ label: label.trim(), detail: "Entered manually", amount: parsed });
    onDone();
  };

  return (
    <form
      className="flex flex-wrap items-end gap-2 border-b border-line-soft bg-cream px-5 py-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
        <span className="text-[12.5px] text-muted">Liability</span>
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Short-term debt"
          className="rounded-[9px] border border-line bg-white px-3 py-2 text-sm outline-none placeholder:text-faint focus:border-brand"
        />
      </label>

      <label className="flex w-[140px] flex-col gap-1.5">
        <span className="text-[12.5px] text-muted">Amount (USD)</span>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          className="rounded-[9px] border border-line bg-white px-3 py-2 font-mono text-sm outline-none placeholder:text-faint focus:border-brand"
        />
      </label>

      <Button type="submit" size="sm" className="py-2.5">
        Add
      </Button>
    </form>
  );
}
