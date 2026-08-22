import Image from "next/image";

import { references } from "@/data/references";

/**
 * Mark top-left, arrow top-right, name pinned to the bottom edge. Pushing the
 * name down rather than letting it sit under each mark is what keeps the three
 * names on one line across the row, since the lockups are drawn to different
 * heights (see `markHeight`).
 */
export function References() {
  return (
    <section
      id="references"
      className="mt-20 flex w-full max-w-[1120px] scroll-mt-24 flex-col gap-8 lg:mt-24"
    >
      {/* Sized with "Made Possible With": both are section labels over a set of
          credits, so they answer to each other rather than to the hero. */}
      <h2 className="text-[22px] tracking-[-0.02em] lg:text-[26px]">Our References</h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {references.map((reference) => (
          <li key={reference.url}>
            <a
              href={reference.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col justify-between gap-6 rounded-[14px] border border-line bg-white p-6 transition-colors hover:border-brand/40 hover:text-brand"
            >
              <span className="flex items-start justify-between gap-4">
                <Image
                  src={reference.logo.src}
                  // The name is set below the mark, so giving the image its own
                  // alt would have a screen reader read the card twice.
                  alt=""
                  aria-hidden
                  width={reference.logo.width}
                  height={reference.logo.height}
                  // Same trade as the partner row: the SVG skips the optimiser
                  // rather than loosen the image config for it.
                  unoptimized={reference.logo.src.endsWith(".svg")}
                  // Per-logo rather than a shared class, because Tailwind
                  // cannot see a class name assembled from data.
                  style={{ height: reference.logo.markHeight }}
                  className="w-auto object-contain"
                />
                <span aria-hidden className="text-faint">
                  ↗
                </span>
              </span>

              <span className="text-[16px] leading-snug font-semibold">{reference.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
