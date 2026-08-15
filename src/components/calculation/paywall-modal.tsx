"use client";

import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/lock-icon";
import { PREMIUM_PRICE_SOL, TREASURY_ADDRESS } from "@/data/premium";
import { formatSol, shortenAddress } from "@/lib/format";
import { RECONSTRUCTED_YEARS } from "@/lib/hawl";
import { payToOpen } from "@/lib/pay";
import { useWallet } from "@/state/use-wallet";

type PaywallModalProps = {
  /** The wallet whose earlier years this opens. */
  address: string;
  onClose: () => void;
  /** Called once the server has confirmed the payment against the chain. */
  onOpened: () => void;
};

/**
 * What opening earlier years costs and what it buys. States the amount and the
 * recipient before anything is signed — the wallet prompt should confirm what
 * the page already said, not introduce it.
 */
export function PaywallModal({ address, onClose, onOpened }: PaywallModalProps) {
  const titleId = useId();
  const wallet = useWallet();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !paying) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, paying]);

  const configured = Boolean(TREASURY_ADDRESS);
  const notice =
    error ?? (configured ? null : "No treasury address is set, so there is nowhere to pay.");

  const pay = async () => {
    setError(null);

    // Connecting is part of paying, so it happens here rather than sending
    // anyone off to a different dialog first.
    const payer = wallet.address ?? (await wallet.connect());
    if (!payer) return;

    setPaying(true);
    const result = await payToOpen(address, payer);
    setPaying(false);

    if (result.status === "unlocked") {
      onOpened();
      onClose();

      return;
    }

    if (result.status === "failed") setError(result.error);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        disabled={paying}
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
            <h2 id={titleId} className="flex items-center gap-2 text-[22px]">
              <LockIcon className="size-[19px] text-brand" />
              Open earlier years
            </h2>
            <p className="text-[13.5px] leading-relaxed text-muted">
              The current year is always free. Paying opens the {RECONSTRUCTED_YEARS} hawls before
              it for {shortenAddress(address)} — each rebuilt from the chain, with the gold price
              and holdings behind it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={paying}
            aria-label="Close"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-line text-[15px] text-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-[12px] border border-line bg-white p-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[13px] text-muted">One payment</span>
            <span className="tabular-nums text-[22px] font-semibold">
              {formatSol(PREMIUM_PRICE_SOL)}
            </span>
          </div>

          {configured ? (
            <div className="flex items-baseline justify-between gap-4 border-t border-line-soft pt-3">
              <span className="text-[13px] text-muted">Paid to</span>
              <span className="font-mono text-[12px] text-ink-soft">
                {shortenAddress(TREASURY_ADDRESS)}
              </span>
            </div>
          ) : null}
        </div>

        <Button disabled={!configured || paying} onClick={() => void pay()}>
          {paying
            ? "Confirming…"
            : wallet.address
              ? `Pay ${formatSol(PREMIUM_PRICE_SOL)}`
              : "Connect wallet to pay"}
        </Button>

        {notice ? (
          <p role="alert" className="-mt-2.5 text-[12.5px] text-danger">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
