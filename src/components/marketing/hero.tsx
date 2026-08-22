import { Suspense } from "react";

import { AddressSearch } from "@/components/marketing/address-search";
import { MetricsCard, MetricsCardFallback } from "@/components/marketing/metrics-card";

/**
 * Two columns: the way in on the left, what the calculator has counted so far
 * on the right. The card is the only part of the page that waits on a database,
 * so it sits behind its own boundary — a slow read holds up the three figures
 * and nothing else, and the form is usable while they land.
 */
export function Hero() {
  return (
    <section className="grid w-full max-w-[1120px] gap-12 pt-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-16 lg:pt-20">
      <div className="flex flex-col items-start">
        <h1 className="text-[28px] leading-[1.12] tracking-[-0.03em] sm:text-[34px] lg:text-[40px]">
          Zakat, straight from your <span className="text-brand">wallet</span>
        </h1>

        <p className="mt-5 max-w-[520px] text-base leading-relaxed text-muted lg:text-[19px]">
          Paste a Solana address. We price it and check it against the nisab.
        </p>

        <div className="mt-8 w-full">
          <AddressSearch />
        </div>
      </div>

      <Suspense fallback={<MetricsCardFallback />}>
        <MetricsCard />
      </Suspense>
    </section>
  );
}
