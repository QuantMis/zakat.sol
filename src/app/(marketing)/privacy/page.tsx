import { Prose } from "@/components/content/prose";
import { ClearSettingsButton } from "@/components/legal/clear-settings-button";
import { privacySections, privacyUpdatedAt } from "@/data/legal";
import { formatGregorian } from "@/lib/format";

export const metadata = {
  title: "Privacy",
  description:
    "What zakat.sol reads from a Solana address, what stays in your browser, and what it can never do.",
};

export default function PrivacyPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-5 pt-14 sm:px-8 lg:pt-20">
      <header className="flex flex-col gap-4">
        <span className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase">Legal</span>
        <h1 className="text-[38px] tracking-[-0.03em] lg:text-[46px]">Privacy</h1>
        <p className="max-w-[620px] text-[16px] leading-relaxed text-muted lg:text-[18px]">
          A calculator that only ever reads has little to say about your data — but what there is,
          is set out here in full.
        </p>
        <p className="font-mono text-[12px] text-faint">
          Last updated {formatGregorian(privacyUpdatedAt)}
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:gap-16">
        <nav
          aria-label="On this page"
          className="lg:sticky lg:top-8 lg:h-fit lg:w-[220px] lg:shrink-0"
        >
          <p className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
            On this page
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {privacySections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-[14px] text-muted transition-colors hover:text-brand"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex max-w-[720px] flex-col gap-12">
          {privacySections.map((section) => (
            <section key={section.id} id={section.id} className="flex scroll-mt-8 flex-col gap-5">
              <h2 className="text-[24px] tracking-[-0.02em]">{section.title}</h2>
              <Prose blocks={section.body} />
              {section.id === "controls" ? <ClearSettingsButton /> : null}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
