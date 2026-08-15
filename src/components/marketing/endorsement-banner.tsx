const seals = ["fatwa body seal", "scholar council mark"];

export function EndorsementBanner() {
  return (
    <section className="relative mt-20 flex w-full max-w-[1120px] flex-col items-center gap-8 rounded-[18px] border border-brand/28 bg-[#F7FAF7] px-6 py-9 text-left lg:mt-24 lg:flex-row lg:gap-11 lg:px-11">
      <div className="flex flex-1 flex-col gap-2.5">
        <span className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase">
          Ruling &amp; endorsement
        </span>
        <h2 className="text-2xl tracking-[-0.02em] lg:text-[28px]">
          Our method is reviewed by scholars, not by us
        </h2>
        <p className="max-w-[520px] text-[15px] leading-relaxed text-muted">
          Every rule this calculator applies to SOL, stablecoins and SPL tokens is signed off by a
          recognised fatwa body. The ruling is published in full.
        </p>
        <p className="pt-1.5 text-[14.5px] font-semibold text-brand">Read the ruling →</p>
      </div>

      <div className="flex gap-3.5">
        {seals.map((seal) => (
          <div
            key={seal}
            className="hatched flex h-[110px] w-[150px] items-center justify-center rounded-[12px] border border-dashed border-ink/20 p-3 text-center font-mono text-[10px] leading-snug text-faint"
          >
            {seal}
          </div>
        ))}
      </div>
    </section>
  );
}
