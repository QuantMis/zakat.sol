import { AddressSearch } from "@/components/marketing/address-search";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-16 text-center lg:pt-26">
      <h1 className="max-w-[940px] text-[40px] leading-[1.06] tracking-[-0.035em] sm:text-6xl lg:text-[76px] lg:leading-[1.04]">
        Zakat, straight from your <span className="text-brand">wallet</span>
      </h1>

      <p className="mt-5.5 max-w-[620px] text-base leading-relaxed text-muted lg:text-[19px]">
        Paste a Solana address. We price it and check it against the nisab.
      </p>

      <div className="mt-9 flex w-full justify-center px-5">
        <AddressSearch />
      </div>
    </section>
  );
}
