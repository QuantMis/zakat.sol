import { cn } from "@/lib/cn";

import { rowGrid } from "./grid";

/**
 * Placeholders shaped like the thing that is loading, so the page does not jump
 * when the scan lands. A wallet takes a couple of seconds to read and price.
 */

function Bar({ className }: { className?: string }) {
  return <span className={cn("block h-3 rounded-full bg-line-soft", className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-[14px] border border-line bg-cream p-5">
      <Bar className="h-2.5 w-24" />
      <Bar className="h-6 w-36" />
    </div>
  );
}

export function AssetRowSkeleton() {
  return (
    <div className={cn(rowGrid, "animate-pulse border-b border-line-soft px-5 py-3.5")}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="size-[30px] shrink-0 rounded-full bg-line-soft" />
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Bar className="w-28" />
          <Bar className="h-2 w-12" />
        </span>
      </div>

      <div className="hidden justify-end md:flex">
        <Bar className="w-16" />
      </div>
      <div className="hidden justify-end md:flex">
        <Bar className="w-12" />
      </div>
      <div className="flex justify-end">
        <Bar className="w-20" />
      </div>
      <div className="flex justify-end">
        <Bar className="h-5 w-9 rounded-full" />
      </div>
    </div>
  );
}

/** Enough rows to fill the panel without pretending to know how many there are. */
export function AssetTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <AssetRowSkeleton key={index} />
      ))}
    </>
  );
}
