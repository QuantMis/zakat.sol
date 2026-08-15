import Image from "next/image";
import Link from "next/link";

import { PageBackdrop } from "@/components/marketing/page-backdrop";
import { StakeEstimator } from "@/components/sanctum/stake-estimator";
import { buttonStyles } from "@/components/ui/button";
import { sanctumUrl, stakeSteps, stakingTreatments } from "@/data/sanctum";

export const metadata = {
  title: "Sanctum stake",
  description:
    "Stake SOL through Sanctum and keep the zakat arithmetic straight: how liquid staking tokens are priced, and how their yield is counted.",
};

export default function SanctumPage() {
  return (
    <>
      <PageBackdrop />

      <main className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-5 pt-14 sm:px-8 lg:pt-20">
        <section className="flex flex-col items-start gap-5">
          {/* Neutral pill so Sanctum's own blue/black mark isn't fighting the brand tint. */}
          <span className="flex items-center gap-2.5 rounded-full border border-line bg-cream py-1.5 pr-4 pl-3">
            <Image
              src="/sanctum-wordmark.png"
              alt="Sanctum"
              width={133}
              height={26}
              className="h-[17px] w-auto"
            />
            <span className="text-[11px] tracking-[0.12em] text-muted uppercase">
              liquid staking
            </span>
          </span>

          <h1 className="max-w-[820px] text-[40px] leading-[1.06] tracking-[-0.035em] lg:text-[58px]">
            Stake your SOL. Keep the zakat <span className="text-brand">honest</span>.
          </h1>

          <p className="max-w-[620px] text-[16px] leading-relaxed text-muted lg:text-[19px]">
            A liquid staking token keeps your SOL earning while it stays yours to move. It is also
            still zakatable — so the scan prices it the way it prices everything else, and the yield
            never quietly falls out of the calculation.
          </p>

          <div className="mt-2 flex flex-col gap-3.5 sm:flex-row">
            <a
              href={sanctumUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles("primary", "lg")}
            >
              Open Sanctum ↗
            </a>
            <Link href="/portfolio" className={buttonStyles("outline", "lg")}>
              See it in your report
            </Link>
          </div>

          <p className="text-xs text-faint">
            Staking happens in Sanctum, in your wallet. zakat.sol never signs a transaction.
          </p>
        </section>

        <div className="mt-14">
          <StakeEstimator />
        </div>

        <section className="mt-20 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] tracking-[-0.025em] lg:text-[34px]">
              How a stake lands in the report
            </h2>
            <p className="max-w-[620px] text-[15.5px] leading-relaxed text-muted">
              Four parts, and only one of them carries a figure. The rest are there because people
              reasonably expect a line and there is a reason there isn&apos;t one.
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
            {stakingTreatments.map((treatment) => (
              <div key={treatment.title} className="flex flex-col gap-2.5 bg-white p-6">
                <dt className="text-[16px] font-semibold">{treatment.title}</dt>
                <dd className="text-[14.5px] leading-relaxed text-muted">{treatment.detail}</dd>
              </div>
            ))}
          </dl>

          <p className="text-[14px] text-muted">
            Some scholars treat staking yield as income due at receipt instead.{" "}
            <Link
              href="/blog/liquid-staking-and-zakat"
              className="font-semibold text-brand hover:text-brand-bright"
            >
              Where that changes the answer →
            </Link>
          </p>
        </section>

        <section className="mt-20 flex flex-col gap-8">
          <h2 className="text-[28px] tracking-[-0.025em] lg:text-[34px]">
            Three steps, one address
          </h2>

          <ol className="grid gap-5 md:grid-cols-3">
            {stakeSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-[14px] border border-line bg-cream-soft p-6"
              >
                <span className="flex size-8 items-center justify-center rounded-[9px] bg-brand/12 text-[13px] font-semibold text-brand">
                  {index + 1}
                </span>
                <h3 className="text-[17px]">{step.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}
