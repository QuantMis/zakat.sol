"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CalculatorIcon } from "@/components/ui/calculator-icon";

/**
 * Hero entry point: an address goes straight to the report, no wallet needed.
 * Like the modal's watch form, the scan is still the sample one.
 */
export function AddressSearch() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/portfolio");
      }}
      className="flex w-full max-w-[560px] items-center gap-2 rounded-[14px] border border-line bg-white py-2 pr-2 pl-4.5 shadow-[0_18px_40px_rgba(20,37,28,0.07)] transition-colors focus-within:border-brand"
    >
      <label htmlFor="hero-address" className="sr-only">
        Solana wallet address
      </label>
      <input
        id="hero-address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Paste a Solana address or name.sol"
        spellCheck={false}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-[13.5px] text-ink outline-none placeholder:text-faint"
      />
      <button
        type="submit"
        aria-label="Calculate zakat"
        className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] text-brand transition-colors hover:text-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <CalculatorIcon className="size-[28px]" />
      </button>
    </form>
  );
}
