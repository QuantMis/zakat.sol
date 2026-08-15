import { PhantomIcon } from "@/components/wallet/phantom-icon";
import { portfolio } from "@/data/portfolio";
import { shortenAddress } from "@/lib/format";

export function WalletBadge() {
  return (
    <div className="flex items-center gap-2.5 rounded-[11px] border border-line bg-cream p-3">
      <PhantomIcon className="size-[30px] shrink-0 rounded-lg" />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[13.5px] font-semibold">{portfolio.domain}</span>
        <span className="font-mono text-[11px] text-muted-soft">
          {shortenAddress(portfolio.address)}
        </span>
      </span>
    </div>
  );
}
