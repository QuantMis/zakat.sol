import Image from "next/image";

import { partners } from "@/data/partners";

/**
 * The marks are wordmarks — each already carries the name — so nothing is set
 * twice and the name goes to the image's alt text. They sit bare on the page:
 * no frame and nothing to click, so the row credits without inviting a detour
 * off the landing page. Each is drawn to its own optically balanced height
 * (see `markHeight`), which is what makes an uneven set of lockups read evenly.
 */
export function Partners() {
  return (
    <section
      id="made-possible-with"
      className="mt-20 flex w-full max-w-[1120px] scroll-mt-24 flex-col gap-8 lg:mt-24"
    >
      {/* Matched to "Our References" — the two sections sit back to back and
          rank the same, so a step between them would read as a hierarchy that
          isn't there. Tracking eases off with the size; the tighter figure
          belongs to the larger headings above. */}
      <h2 className="text-[22px] tracking-[-0.02em] lg:text-[26px]">Made Possible With</h2>

      {/* Wider gaps than the pills used, which is the separation the borders
          were doing before — without them the marks would otherwise crowd. */}
      <ul className="flex flex-wrap items-center justify-center gap-x-11 gap-y-8 py-2 sm:gap-x-14">
        {partners.map((partner) => (
          <li key={partner.name}>
            <Image
              src={partner.logo}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              // The SVGs would need the image config loosened to be optimised;
              // the one raster mark is left for Next to resize and re-encode.
              unoptimized={partner.logo.endsWith(".svg")}
              // Per-logo rather than a shared class: Tailwind cannot see a
              // class name assembled from data, and these are data.
              style={{ height: partner.markHeight }}
              className="w-auto object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
