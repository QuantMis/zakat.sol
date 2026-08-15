import { NISAB_GRAMS, ZAKAT_RATE } from "@/lib/zakat";

const stats = [
  { value: `${ZAKAT_RATE * 100}%`, label: "of qualifying wealth held a full hawl" },
  { value: `${NISAB_GRAMS.gold}g`, label: "gold nisab, repriced every hour" },
  { value: "640+", label: "SPL tokens priced at scan time" },
];

export function StatBand() {
  return (
    <dl className="relative mt-16 grid w-full max-w-[1120px] border-t border-line sm:grid-cols-3 lg:mt-19">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 border-line px-5 py-8 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0"
        >
          <dt className="text-[36px] font-semibold tracking-[-0.02em] text-brand lg:text-[44px]">
            {stat.value}
          </dt>
          <dd className="text-[14.5px] text-muted">{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}
