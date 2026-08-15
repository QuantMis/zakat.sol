import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-line bg-white", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-line-soft px-5 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small tracked caps label used above every panel in the design. */
export function PanelLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] tracking-[0.12em] text-faint uppercase">{children}</span>;
}

export function PanelRow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-4 not-last:border-b not-last:border-line-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
