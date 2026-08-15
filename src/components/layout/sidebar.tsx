"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { WalletBadge } from "@/components/layout/wallet-badge";
import { cn } from "@/lib/cn";
import { dashboardNav } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col gap-7 border-r border-line-soft bg-shell p-4 pt-5.5 print:hidden lg:flex">
      <Logo className="px-2 text-[17px]" />

      <nav className="flex flex-col gap-1">
        {dashboardNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "rounded-[9px] px-3 py-2.5 text-[14.5px] transition-colors",
              pathname === item.href
                ? "bg-brand/10 font-medium text-brand"
                : "text-muted hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <WalletBadge />
      </div>
    </aside>
  );
}
