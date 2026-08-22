"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CalculatorIcon } from "@/components/ui/calculator-icon";
import { SearchIcon } from "@/components/ui/search-icon";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { useWallet } from "@/state/use-wallet";

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Hero entry point: an address goes straight to the report, no wallet needed.
 * Pasting produces the same report connecting would, which is why the two sit
 * side by side under the field rather than one being offered as the way in.
 */
export function AddressSearch() {
  const router = useRouter();
  const { address: connected, disconnect } = useWallet();
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = address.trim();

    // Checked here as well as in the route so a typo says so immediately,
    // rather than after a round trip that was never going to succeed.
    if (!BASE58_ADDRESS.test(trimmed)) {
      setError("That does not look like a Solana address.");

      return;
    }

    setError(null);

    // A pasted address is the wallet being asked about from here on, so any
    // connection is dropped before the report opens rather than left behind it
    // — the badge, the paywall and a reload all read the connected wallet, and
    // a stale one would quietly speak for the address on screen. Phantom
    // refusing to let go is not a reason to hold back the report: the session
    // is cleared on our side either way.
    if (connected) await disconnect().catch(() => {});

    router.push(`/calculation?address=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="flex w-full max-w-[560px] flex-col gap-3"
    >
      <div className="flex w-full items-center gap-3 rounded-[14px] border border-line bg-white py-3.5 pr-4 pl-4.5 shadow-[0_18px_40px_rgba(20,37,28,0.07)] transition-colors focus-within:border-brand">
        <SearchIcon className="size-[19px] shrink-0 text-faint" />
        <label htmlFor="hero-address" className="sr-only">
          Solana wallet address
        </label>
        <input
          id="hero-address"
          value={address}
          onChange={(event) => {
            setAddress(event.target.value);
            setError(null);
          }}
          placeholder="Paste a Solana address"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-faint"
        />
      </div>

      {error ? (
        <p role="alert" className="px-1 text-left text-[12.5px] text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {/* The form's submit, so the field still goes on Enter alone. */}
        <Button type="submit">
          <CalculatorIcon className="size-[19px]" />
          Calculate zakat
        </Button>

        <ConnectWalletButton variant="outline">Connect wallet</ConnectWalletButton>
      </div>
    </form>
  );
}
