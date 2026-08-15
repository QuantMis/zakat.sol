import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/lib/navigation";

const socials = ["X", "TG", "GH"];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 flex flex-col gap-14 border-t border-line bg-cream-soft px-5 pt-16 pb-10 sm:px-8 lg:px-16">
      <div className="flex flex-col justify-between gap-14 lg:flex-row">
        <div className="flex max-w-[420px] flex-col gap-4.5">
          <p className="text-[26px] leading-tight font-bold tracking-[-0.025em] lg:text-[32px]">
            Zakat, straight from your wallet
          </p>

          <p className="text-[15px] leading-relaxed text-muted">
            Paste an address or connect a wallet. The calculator reads it, prices it against the
            nisab, and never asks to sign anything.
          </p>

          <div className="flex gap-2.5 pt-1.5">
            {socials.map((social) => (
              <span
                key={social}
                className="flex size-9 items-center justify-center rounded-[9px] bg-[#EFEDE3] text-[13px] text-ink-soft"
              >
                {social}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerNav.map((column) => (
            <div key={column.title} className="flex w-[180px] flex-col gap-3.5">
              <p className="text-[11px] tracking-[0.12em] text-faint uppercase">
                {column.title}
              </p>
              {column.links.map((link) =>
                "href" in link ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14.5px] text-ink-soft transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span key={link.label} className="text-[14.5px] text-ink-soft">
                    {link.label}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6.5">
        <Logo className="text-[15px]" markClassName="h-[22px]" />
        <p className="text-xs text-faint">
          © 2026 · Read-only, never signs a transaction
        </p>
      </div>
    </footer>
  );
}
