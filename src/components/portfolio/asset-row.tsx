import { TokenLogo } from "@/components/portfolio/token-logo";
import { formatBalance, formatPrice, formatUsd } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { assetValue } from "@/lib/zakat";

import { rowGrid } from "./grid";

export function AssetRow({ asset }: { asset: Asset }) {
  const balance = formatBalance(asset.balance, asset.displayDecimals);

  return (
    <div className={`${rowGrid} border-b border-line-soft px-5 py-3.5`}>
      <div className="flex min-w-0 items-center gap-3">
        <TokenLogo src={asset.icon} symbol={asset.symbol} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14.5px] font-medium">{asset.name}</span>
          <span className="text-[11px] text-faint">
            <span className="md:hidden">{balance} </span>
            {asset.symbol}
          </span>
        </span>
      </div>

      <div className="hidden text-right tabular-nums text-[13.5px] text-ink-soft md:block">
        {balance}
      </div>
      <div className="hidden text-right tabular-nums text-[13.5px] text-muted md:block">
        {formatPrice(asset.price)}
      </div>
      <div className="text-right tabular-nums text-[14.5px] font-medium">
        {formatUsd(assetValue(asset))}
      </div>
    </div>
  );
}
