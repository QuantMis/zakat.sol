"use client";

import { useState } from "react";

import { LstPicker } from "@/components/sanctum/lst-picker";
import { Panel, PanelHeader, PanelLabel } from "@/components/ui/panel";
import { StatCard } from "@/components/ui/stat-card";
import { metalPrices } from "@/data/nisab";
import { portfolio, solPrice } from "@/data/portfolio";
import { stakingTokens } from "@/data/sanctum";
import { formatPercent, formatSol, formatUsd } from "@/lib/format";
import { HAWL_DAYS, hawlApy, projectStake } from "@/lib/staking";
import { nisabBasisLabel, nisabThreshold, ZAKAT_RATE } from "@/lib/zakat";
import { useZakatSettings } from "@/state/zakat-settings";

const scannedSol = portfolio.assets.find((asset) => asset.symbol === "SOL")?.balance ?? 0;

export function StakeEstimator() {
  const { settings } = useZakatSettings();
  const [amount, setAmount] = useState(String(scannedSol));
  const [symbol, setSymbol] = useState(stakingTokens[0].symbol);

  const token = stakingTokens.find((entry) => entry.symbol === symbol) ?? stakingTokens[0];
  const amountSol = Math.max(0, Number.parseFloat(amount) || 0);
  const projection = projectStake(amountSol, token.apy, solPrice);

  const nisab = nisabThreshold(settings.nisabBasis, metalPrices);
  const aboveNisab = projection.valueAtHawl >= nisab;

  return (
    <Panel className="w-full">
      <PanelHeader>
        <PanelLabel>Stake estimator</PanelLabel>
        <span className="font-mono text-[11.5px] text-faint">SOL {formatUsd(solPrice)}</span>
      </PanelHeader>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col gap-4">
          <label htmlFor="stake-amount" className="text-[14.5px] font-medium">
            Amount to stake
          </label>

          <div className="flex items-center gap-3 rounded-[11px] border border-line bg-cream-soft px-4 py-3.5 focus-within:border-brand">
            <input
              id="stake-amount"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.001"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-mono text-[19px] outline-none"
            />
            <span className="font-mono text-[13px] text-faint">SOL</span>
          </div>

          <button
            type="button"
            onClick={() => setAmount(String(scannedSol))}
            className="w-fit font-mono text-[11.5px] text-muted transition-colors hover:text-brand"
          >
            Use the scanned balance · {formatSol(scannedSol)}
          </button>

          <div className="mt-1 overflow-hidden rounded-[11px] border border-line">
            <LstPicker tokens={stakingTokens} value={symbol} onChange={setSymbol} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Staked today" value={formatUsd(projection.stakedValue)} />
            <StatCard
              label={`Yield over one hawl · ${formatPercent(hawlApy(token.apy))}`}
              value={formatUsd(projection.yieldValue)}
            />
            <StatCard label="Value at hawl end" value={formatUsd(projection.valueAtHawl)} />
            <StatCard
              label={`Zakat at ${ZAKAT_RATE * 100}%`}
              value={aboveNisab ? formatUsd(projection.zakatDue) : formatUsd(0)}
              tone={aboveNisab ? "brand" : "muted"}
            />
          </div>

          <div className="flex flex-col gap-2 rounded-[13px] border border-line bg-cream-soft px-5 py-4">
            <p className="text-[13.5px] text-ink-soft">
              {aboveNisab
                ? `Above the ${nisabBasisLabel(settings.nisabBasis)} nisab of ${formatUsd(nisab)}, so zakat is due on the whole balance.`
                : `Below the ${nisabBasisLabel(settings.nisabBasis)} nisab of ${formatUsd(nisab)} — nothing is due on this alone, but it still counts towards the rest of the wallet.`}
            </p>
            {settings.showSolEquivalent ? (
              <p className="font-mono text-[11.5px] text-faint">
                {formatSol(projection.yieldSol)} earned · {formatSol(projection.zakatDue / solPrice)}{" "}
                due
              </p>
            ) : null}
          </div>

          <p className="text-[12.5px] leading-relaxed text-faint">
            A hawl is {HAWL_DAYS} days, so the annual rate is scaled to the lunar year. The SOL price
            is held flat at the scan price — this shows what the yield adds, not where the market
            goes.
          </p>
        </div>
      </div>
    </Panel>
  );
}
