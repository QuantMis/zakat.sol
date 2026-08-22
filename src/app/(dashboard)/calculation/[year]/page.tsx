import type { Metadata } from "next";
import { Suspense } from "react";

import { YearDetail } from "@/components/calculation/year-detail";

/**
 * The segment is the hawl's hijri year — that is what keeps two hawls landing
 * in one Gregorian year apart — but the app writes its years in the Gregorian
 * calendar, so titling the tab with it would name a year shown nowhere on the
 * page. The heading carries the year instead.
 */
export function generateMetadata(): Metadata {
  return { title: "Zakatable Wealth" };
}

export default async function YearPage(props: PageProps<"/calculation/[year]">) {
  const { year } = await props.params;

  return (
    <div className="flex min-w-0 flex-1 flex-col p-5 lg:p-8">
      {/* The year is rebuilt in the browser from the scanned address, which
          is a request-time value the prerender cannot know. */}
      <Suspense fallback={null}>
        <YearDetail id={year} />
      </Suspense>
    </div>
  );
}
