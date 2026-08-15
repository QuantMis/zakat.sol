"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { cn } from "@/lib/cn";
import { dashboardNav, watchedHref } from "@/lib/navigation";

type Variant = "sidebar" | "mobile";

const variants: Record<Variant, string> = {
  sidebar: "rounded-[9px] px-3 py-2.5 text-[14.5px] transition-colors",
  mobile: "shrink-0 rounded-[9px] px-3 py-1.5 text-[13.5px] whitespace-nowrap transition-colors",
};

/** Hover only where there is a pointer to hover with. */
const resting: Record<Variant, string> = {
  sidebar: "text-muted hover:text-ink",
  mobile: "text-muted",
};

function Links({ variant, watched }: { variant: Variant; watched: string | null }) {
  const pathname = usePathname();

  return (
    <>
      {dashboardNav.map((item) => {
        const current = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={watchedHref(item.href, watched)}
            aria-current={current ? "page" : undefined}
            className={cn(
              variants[variant],
              current ? "bg-brand/10 font-medium text-brand" : resting[variant],
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function Watching({ variant }: { variant: Variant }) {
  return <Links variant={variant} watched={useSearchParams().get("address")} />;
}

/**
 * The dashboard's screens, linked so a watched address survives the move
 * between them.
 *
 * The address is a request-time value a prerender cannot know, so the fallback
 * is the same nav without one: the links are in the first paint and pick the
 * address up on hydration.
 */
export function DashboardLinks({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={<Links variant={variant} watched={null} />}>
      <Watching variant={variant} />
    </Suspense>
  );
}
