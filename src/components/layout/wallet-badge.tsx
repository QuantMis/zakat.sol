"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useConnectWallet } from "@/components/wallet/connect-wallet-provider";
import { shortenAddress } from "@/lib/format";
import { usePortfolio } from "@/state/use-portfolio";
import { useWallet } from "@/state/use-wallet";

/**
 * Names the wallet the dashboard is reporting on: the connected one once
 * Phantom has approved, a pasted address when one is being watched, and
 * "Not connected" before either.
 *
 * The address is the whole label — how it got there is already said by the
 * button beside it, which offers to connect or to disconnect.
 */
export function WalletBadge() {
  const { address, disconnect } = useWallet();
  const { snapshot } = usePortfolio();
  const { open } = useConnectWallet();
  const router = useRouter();

  // A pasted address is reported on without a wallet ever being connected.
  const scanned = address ?? snapshot.address;

  // Watched rather than done in the click handler, so a disconnect from inside
  // Phantom — locking, or revoking the site — leaves as well. Only a wallet
  // that *was* connected sends anyone home: someone reading a pasted address
  // has no connection to lose and must be left where they are.
  const wasConnected = useRef(false);

  useEffect(() => {
    if (address) {
      wasConnected.current = true;

      return;
    }

    if (!wasConnected.current) return;

    wasConnected.current = false;
    router.push("/");
  }, [address, router]);

  return (
    <div className="flex min-w-0 items-center gap-2">
      {/* Both sit at the same fixed height, so the pill and the button read as
          one control rather than two that nearly line up. */}
      <span className="flex h-9 min-w-0 items-center rounded-full border border-line bg-cream px-4 sm:min-w-[210px]">
        <span className="truncate text-[12.5px] font-semibold">
          {scanned ? shortenAddress(scanned) : "Not connected"}
        </span>
      </span>

      <button
        type="button"
        onClick={() => void (address ? disconnect() : open())}
        className="flex h-9 shrink-0 items-center rounded-full border border-line px-3.5 text-[11.5px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {address ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
