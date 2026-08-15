"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { marketingNav } from "@/lib/navigation";

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6.5 text-sm md:flex">
      {marketingNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              active ? "font-medium text-ink" : "text-muted hover:text-ink",
            )}
          >
            {"wordmark" in item ? (
              <Image
                src={item.wordmark.src}
                alt={item.label}
                width={item.wordmark.width}
                height={item.wordmark.height}
                // Text colour can't carry the active/hover state on an image.
                className={cn(
                  "h-[17px] w-auto transition-opacity",
                  active ? "opacity-100" : "opacity-70 hover:opacity-100",
                )}
              />
            ) : (
              item.label
            )}
          </Link>
        );
      })}
    </nav>
  );
}
