import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  markClassName?: string;
};

export function Logo({ className, markClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-bold tracking-[-0.01em]", className)}>
      {/* Wider than it is tall, so callers set a height and let the width follow. */}
      <Image
        src="/zakat-mark.png"
        alt=""
        width={664}
        height={555}
        className={cn("h-[23px] w-auto", markClassName)}
      />
      <span>
        zakat<span className="text-brand">.sol</span>
      </span>
    </Link>
  );
}
