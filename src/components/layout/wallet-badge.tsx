"use client";

import { PhantomIcon } from "@/components/wallet/phantom-icon";
import { useConnectWallet } from "@/components/wallet/connect-wallet-provider";
import { shortenAddress } from "@/lib/format";
import { walletLabel } from "@/lib/portfolio";
import { usePortfolio } from "@/state/use-portfolio";
import { useWallet } from "@/state/use-wallet";

/**
 * Names the wallet the dashboard is reporting on: the connected one once
 * Phantom has approved, a pasted address when one is being watched, and
 * nothing at all before either.
 */
export function WalletBadge() {
  const { address, disconnect } = useWallet();
  const { snapshot } = usePortfolio();
  const { open } = useConnectWallet();

  // A pasted address is reported on without a wallet ever being connected.
  const watching = !address && Boolean(walletLabel(snapshot));
  const scanned = address ?? snapshot.address;

  return (
    <div className="flex flex-col gap-2.5 rounded-[11px] border border-line bg-cream p-3">
      <div className="flex items-center gap-2.5">
        <PhantomIcon className="size-[30px] shrink-0 rounded-lg" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[13.5px] font-semibold">
            {address ? "Phantom" : watching ? "Watching" : "Not connected"}
          </span>
          <span className="truncate text-[11px] text-muted-soft">
            {scanned ? shortenAddress(scanned) : "—"}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => void (address ? disconnect() : open())}
        className="rounded-lg border border-line py-1.5 text-[11.5px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {address ? "Disconnect" : "Connect wallet"}
      </button>
    </div>
  );
}
