"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";

import { PhantomIcon } from "@/components/wallet/phantom-icon";
import { phantom } from "@/data/wallets";
import { cn } from "@/lib/cn";
import { useWallet } from "@/state/use-wallet";
import type { WalletStatus } from "@/state/wallet-store";

const walletRow =
  "flex items-center gap-3.5 rounded-[12px] border border-brand bg-[#EFEDE3] p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** What the Phantom row reports while the extension is being asked. */
const statusLabels: Record<WalletStatus, string> = {
  detecting: "Looking…",
  unavailable: "Install",
  disconnected: "Detected",
  connecting: "Approve in Phantom…",
  connected: "Connected",
};

export function ConnectWalletModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const titleId = useId();
  const wallet = useWallet();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const scan = () => {
    onClose();
    router.push("/portfolio");
  };

  /** Approval is Phantom's to grant — we only move on once it has. */
  const connect = async () => {
    if (await wallet.connect()) scan();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/42"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-[456px] flex-col gap-5.5 rounded-[18px] border border-line bg-cream p-7 shadow-[0_40px_90px_rgba(20,37,28,0.16)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 id={titleId} className="text-[22px]">
              Connect a wallet
            </h2>
            <p className="text-[13.5px] leading-relaxed text-muted">
              We read balances only. No approvals, no signatures.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-line text-[15px] text-muted transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {wallet.status === "unavailable" ? (
          <a href={phantom.installUrl} target="_blank" rel="noreferrer" className={walletRow}>
            <PhantomIcon className="size-[38px] shrink-0 rounded-[10px]" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15.5px] font-semibold">{phantom.name}</span>
              <span className="text-[11.5px] text-brand">
                {statusLabels.unavailable}
              </span>
            </span>
            <span className="text-base text-brand">↗</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => void (wallet.address ? scan() : connect())}
            disabled={wallet.status === "detecting" || wallet.status === "connecting"}
            className={cn(walletRow, "disabled:cursor-progress")}
          >
            <PhantomIcon className="size-[38px] shrink-0 rounded-[10px]" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15.5px] font-semibold">{phantom.name}</span>
              <span className="text-[11.5px] text-brand">
                {statusLabels[wallet.status]}
              </span>
            </span>
            <span className="text-base text-brand">→</span>
          </button>
        )}

        {wallet.error ? (
          <p role="alert" className="-mt-2.5 text-[12.5px] text-danger">
            {wallet.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
