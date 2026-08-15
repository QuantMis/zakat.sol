import type { Metadata } from "next";
import { Suspense } from "react";

import { CalculationTopBar } from "@/components/calculation/calculation-top-bar";
import { YearDetail } from "@/components/calculation/year-detail";

export async function generateMetadata(
  props: PageProps<"/calculation/[year]">,
): Promise<Metadata> {
  const { year } = await props.params;

  return { title: `${year} AH · Zakatable Wealth` };
}

export default async function YearPage(props: PageProps<"/calculation/[year]">) {
  const { year } = await props.params;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <CalculationTopBar />

      <div className="flex flex-1 flex-col p-5 lg:p-8">
        {/* The year is rebuilt in the browser from the scanned address, which
            is a request-time value the prerender cannot know. */}
        <Suspense fallback={null}>
          <YearDetail id={year} />
        </Suspense>
      </div>
    </div>
  );
}
