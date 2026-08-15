export function EndorsementCard() {
  return (
    <div className="flex flex-col gap-3.5 rounded-[14px] border border-brand/30 bg-brand/[0.07] p-4.5">
      <span className="font-mono text-[10.5px] tracking-[0.14em] text-brand uppercase">
        Ruling &amp; endorsement
      </span>

      <div className="flex items-center gap-3.5">
        <div
          className="hatched flex size-16 shrink-0 items-center justify-center rounded-[10px] border border-dashed border-ink/20 text-center font-mono text-[8.5px] leading-tight text-faint"
          aria-hidden
        >
          seal / logo
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">[ Fatwa body name ]</p>
          <p className="text-[12.5px] leading-relaxed text-muted">
            Methodology reviewed and approved — fatwa ref [ 000/2026 ]
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
        <span className="text-[12.5px] text-brand">Read the ruling →</span>
        <span className="font-mono text-[10.5px] text-faint">placeholder</span>
      </div>
    </div>
  );
}
