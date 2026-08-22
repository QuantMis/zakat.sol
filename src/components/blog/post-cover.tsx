import { topicLabels } from "@/lib/blog";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/types";

/**
 * Articles have no photography, so the cover is drawn from the same blueprint
 * grid and star motif as the hero — the title is the artwork.
 */
export function PostCover({ post, className }: { post: Post; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-16/9 overflow-hidden rounded-[16px] border border-line bg-mint-soft sm:aspect-16/7",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0">
        <div className="blueprint-grid absolute inset-0 opacity-80" />
        <div className="star absolute -top-16 -right-12 size-[260px] bg-linear-150 from-[#CFE4D6] to-white opacity-70" />
        <div className="star absolute -bottom-14 -left-10 size-[190px] bg-[#E8F1E9]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_100%,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.55)_60%,rgba(255,255,255,0.2)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-end gap-2.5 p-6 sm:p-9">
        <span className="text-[11px] tracking-[0.14em] text-brand uppercase">
          {topicLabels[post.topic]}
        </span>
        <p className="max-w-[600px] text-[24px] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[32px] lg:text-[38px]">
          {post.title}
        </p>
      </div>
    </div>
  );
}
