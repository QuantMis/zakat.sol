import { Logo } from "@/components/layout/logo";

/** Mark and notice only — everything it used to say, the page above says first. */
export function SiteFooter() {
  return (
    <footer className="relative mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line bg-cream-soft px-5 py-4.5 sm:px-8 lg:px-16">
      <Logo className="text-[15px]" markClassName="h-[22px]" />
      <p className="text-xs text-faint">
        Copyright © 2026 Solana Zakat Calculator. All rights reserved.
      </p>
    </footer>
  );
}
