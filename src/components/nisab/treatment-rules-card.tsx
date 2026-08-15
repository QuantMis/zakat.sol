"use client";

import { Toggle } from "@/components/ui/toggle";
import type { TreatmentRules } from "@/lib/types";
import { DUST_THRESHOLD_USD } from "@/lib/zakat";
import { useZakatSettings } from "@/state/zakat-settings";

const rules: Array<{ key: keyof TreatmentRules; title: string; detail: string }> = [
  {
    key: "includeStablecoinsAtFace",
    title: "Include stablecoins at face value",
    detail: "USDC, USDT, PYUSD",
  },
  {
    key: "countGovernanceAsTradeGoods",
    title: "Count governance tokens as trade goods",
    detail: "Valued at market, not cost",
  },
  {
    key: "ignoreDust",
    title: `Ignore balances under $${DUST_THRESHOLD_USD}`,
    detail: "Keeps dust out of the report",
  },
];

export function TreatmentRulesCard() {
  const { settings, setRule } = useZakatSettings();

  return (
    <section className="flex flex-col gap-4 rounded-[14px] border border-line bg-white p-6">
      <h2 className="text-base">Treatment rules</h2>

      <div className="flex flex-col">
        {rules.map((rule) => (
          <div
            key={rule.key}
            className="flex items-center justify-between gap-4 py-3.5 not-last:border-b not-last:border-line-soft"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[14.5px]">{rule.title}</span>
              <span className="text-[12.5px] text-faint">{rule.detail}</span>
            </div>
            <Toggle
              checked={settings.rules[rule.key]}
              onChange={(value) => setRule(rule.key, value)}
              label={rule.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
