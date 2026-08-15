import { references } from "@/data/references";

export function References() {
  return (
    <section
      id="references"
      className="mt-20 flex w-full max-w-[1120px] scroll-mt-24 flex-col gap-8 lg:mt-24"
    >
      <h2 className="text-[28px] tracking-[-0.025em] lg:text-[34px]">Our References</h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {references.map((reference) => (
          <li key={reference.url}>
            <a
              href={reference.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full items-start justify-between gap-4 rounded-[14px] border border-line bg-white p-6 text-[16px] leading-snug font-semibold transition-colors hover:border-brand/40 hover:text-brand"
            >
              {reference.name}
              <span aria-hidden className="text-faint">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
