"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CalculatorIcon } from "@/components/ui/calculator-icon";

/** Base58 alphabet — no 0, O, I or l. A pubkey is 32 bytes, so 32–44 chars. */
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Hero entry point: an address goes straight to the report, no wallet needed.
 * Pasting produces the same report connecting would.
 */
export function AddressSearch() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const trimmed = address.trim();

    // Checked here as well as in the route so a typo says so immediately,
    // rather than after a round trip that was never going to succeed.
    if (!BASE58_ADDRESS.test(trimmed)) {
      setError("That does not look like a Solana address.");

      return;
    }

    setError(null);
    router.push(`/portfolio?address=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col gap-2">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex w-full items-center gap-2 rounded-[14px] border border-line bg-white py-2 pr-2 pl-4.5 shadow-[0_18px_40px_rgba(20,37,28,0.07)] transition-colors focus-within:border-brand"
      >
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
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[13.5px] text-ink outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          aria-label="Calculate zakat"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] text-brand transition-colors hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <CalculatorIcon className="size-[28px]" />
        </button>
      </form>

      {error ? (
        <p role="alert" className="px-1 text-left text-[12.5px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
