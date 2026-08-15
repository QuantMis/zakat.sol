import Image from "next/image";

import { dataSources, type DataSource } from "@/data/data-sources";

/** The partner's own mark where we have it, its initial where we don't. */
function SourceMark({ source }: { source: DataSource }) {
  if (!source.logo) {
    return (
      <span
        aria-hidden
        className="flex size-6.5 items-center justify-center rounded-full bg-brand/12 text-[12px] font-semibold text-brand"
      >
        {source.name.slice(0, 1)}
      </span>
    );
  }

  return (
    <Image
      src={source.logo}
      alt=""
      width={26}
      height={26}
      // Unoptimized so an SVG mark works without loosening the image config.
      unoptimized
      className="size-6.5 rounded-full object-contain"
    />
  );
}

export function DataSources() {
  return (
    <section
      id="data-sources"
      className="mt-20 flex w-full max-w-[1120px] scroll-mt-24 flex-col gap-8 lg:mt-24"
    >
      <h2 className="text-[28px] tracking-[-0.025em] lg:text-[34px]">Our Data Sources</h2>

      <ul className="flex flex-wrap items-center justify-center gap-3">
        {dataSources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pr-5 pl-2 text-[15px] font-medium transition-colors hover:border-brand/40 hover:text-brand"
            >
              <SourceMark source={source} />
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
