"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { portfolio } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { dashboardNav } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-3 border-b border-line-soft bg-shell/95 px-5 py-3.5 backdrop-blur print:hidden lg:hidden">
      <div className="flex items-center justify-between">
        <Logo className="text-[16px]" markClassName="h-[21px]" />
        <span className="flex items-center gap-2 rounded-full border border-line bg-mint-soft px-2.5 py-1.5">
          <span className="size-4 rounded-[5px] bg-[#AB9FF2]" aria-hidden />
          <span className="font-mono text-[11.5px] text-ink-soft">{portfolio.domain}</span>
        </span>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto">
        {dashboardNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-[9px] px-3 py-1.5 text-[13.5px] whitespace-nowrap transition-colors",
              pathname === item.href ? "bg-brand/10 font-medium text-brand" : "text-muted",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
