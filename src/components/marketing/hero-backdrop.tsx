import { cn } from "@/lib/cn";

/** Blueprint grid, drifting stars and the white bloom behind the hero. */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[1000px] overflow-hidden",
        className,
      )}
    >
      <div className="blueprint-grid absolute inset-0" />
      <div className="star absolute -top-[150px] -right-[100px] size-[520px] bg-linear-150 from-[#CFE4D6] to-[#EADFC4] opacity-65" />
      <div className="star absolute top-[300px] right-[330px] size-[190px] bg-[#DCEAE0] max-xl:hidden" />
      <div className="star absolute top-[150px] -left-20 size-[340px] bg-[#E8F1E9] max-lg:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(100%_62%_at_50%_32%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.6)_52%,rgba(20,37,28,0.13)_100%)]" />
    </div>
  );
}
