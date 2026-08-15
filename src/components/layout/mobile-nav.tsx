"use client";

import { DashboardLinks } from "@/components/layout/dashboard-links";
import { Logo } from "@/components/layout/logo";
import { shortenAddress } from "@/lib/format";
import { usePortfolio } from "@/state/use-portfolio";
import { useWallet } from "@/state/use-wallet";

export function MobileNav() {
  const { address } = useWallet();
  const { snapshot } = usePortfolio();
  const scanned = address ?? snapshot.address;

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-3 border-b border-line-soft bg-shell/95 px-5 py-3.5 backdrop-blur print:hidden lg:hidden">
      <div className="flex items-center justify-between">
        <Logo className="text-[16px]" markClassName="h-[21px]" />
        <span className="flex items-center gap-2 rounded-full border border-line bg-mint-soft px-2.5 py-1.5">
          <span className="size-4 rounded-[5px] bg-[#AB9FF2]" aria-hidden />
          <span className="text-[11.5px] text-ink-soft">
            {scanned ? shortenAddress(scanned) : "Not connected"}
          </span>
        </span>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto">
        <DashboardLinks variant="mobile" />
      </nav>
    </div>
  );
}
