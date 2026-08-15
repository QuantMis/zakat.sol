import Link from "next/link";

import { Star } from "@/components/ui/star";
import { cn } from "@/lib/cn";
import type { ContentBlock } from "@/lib/types";

/** Renders the block list behind every article and policy section. */
export function Prose({ blocks, className }: { blocks: ContentBlock[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {blocks.map((block, index) => (
        <Block key={`${block.kind}-${index}`} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <h3 className="pt-3 text-[19px] tracking-[-0.015em]">{block.text}</h3>
      );

    case "paragraph":
      return <p className="text-[15.5px] leading-[1.75] text-ink-soft">{block.text}</p>;

    case "list":
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[15.5px] leading-[1.7] text-ink-soft">
              <Star className="mt-[9px] size-[9px] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "note":
      return (
        <aside className="flex flex-col gap-2 rounded-[13px] border border-brand/25 bg-[#F7FAF7] px-5.5 py-5">
          <span className="text-[11px] tracking-[0.12em] text-brand uppercase">
            {block.title}
          </span>
          <p className="text-[14.5px] leading-relaxed text-ink-soft">{block.text}</p>
          {block.href ? (
            <Link
              href={block.href}
              className="pt-0.5 text-[14px] font-semibold text-brand hover:text-brand-bright"
            >
              {block.linkLabel ?? "Read more"} →
            </Link>
          ) : null}
        </aside>
      );
  }
}
