import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/cn";

/**
 * The bar across the top of every screen. Height, padding, rule and mark are
 * fixed here rather than repeated per screen — they were drifting apart, and
 * the mark moving between the landing page and the dashboard reads as a
 * different site rather than a different section of one.
 *
 * What each screen decides for itself is the background and how the bar sits:
 * the dashboard's is sticky and translucent over content that scrolls under it.
 */
export function HeaderShell({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <header
      className={cn(
        "flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-line-soft px-5 sm:px-8",
        className,
      )}
    >
      {/* `Logo` is itself the link home — do not wrap it in another. */}
      <Logo className="shrink-0 text-[19px]" markClassName="h-[26px]" />

      {children}
    </header>
  );
}
