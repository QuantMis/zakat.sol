"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { PhantomIcon } from "@/components/wallet/phantom-icon";
import { usePhantomInstalled } from "@/components/wallet/use-phantom";
import { phantom } from "@/data/wallets";
import { cn } from "@/lib/cn";

const walletRow =
  "flex items-center gap-3.5 rounded-[12px] border border-brand bg-[#EFEDE3] p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * Wallet selection. Connecting is currently a hand-off to the sample scan —
 * this is where a real wallet adapter would attach.
 */
export function ConnectWalletModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const titleId = useId();
  const [address, setAddress] = useState("");
  const installed = usePhantomInstalled();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const scan = () => router.push("/portfolio");

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

        {installed === false ? (
          <a href={phantom.installUrl} target="_blank" rel="noreferrer" className={walletRow}>
            <PhantomIcon className="size-[38px] shrink-0 rounded-[10px]" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15.5px] font-semibold">{phantom.name}</span>
              <span className="font-mono text-[11.5px] text-brand">Install</span>
            </span>
            <span className="text-base text-brand">↗</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={scan}
            disabled={installed === null}
            className={cn(walletRow, "disabled:cursor-progress")}
          >
            <PhantomIcon className="size-[38px] shrink-0 rounded-[10px]" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15.5px] font-semibold">{phantom.name}</span>
              <span className="font-mono text-[11.5px] text-brand">
                {installed === null ? "Looking…" : "Detected"}
              </span>
            </span>
            <span className="text-base text-brand">→</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] tracking-[0.1em] text-faint">OR</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form
          className="flex flex-col gap-2.5"
          onSubmit={(event) => {
            event.preventDefault();
            scan();
          }}
        >
          <label htmlFor="watch-address" className="text-[13px] text-muted">
            Watch any address
          </label>
          <div className="flex gap-2">
            <input
              id="watch-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Paste address or name.sol"
              className="min-w-0 flex-1 rounded-[10px] border border-line bg-[#F7F5EE] px-3.5 py-3 font-mono text-[12.5px] text-ink outline-none placeholder:text-faint focus:border-brand"
            />
            <Button type="submit" variant="outline" size="sm" className="px-4.5">
              Scan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
