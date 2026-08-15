import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { readingMinutes, topicLabels } from "@/lib/blog";
import { cn } from "@/lib/cn";
import { formatGregorian } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col rounded-[14px] border border-line bg-cream-soft p-6 transition-colors hover:border-brand/40 sm:p-7">
      <span className="text-[11px] tracking-[0.12em] text-brand uppercase">
        {topicLabels[post.topic]}
      </span>

      <h2 className="mt-3.5 text-[21px] leading-snug tracking-[-0.02em] sm:text-[23px]">
        {/* Stretched so the whole card is one link, with the title as its text. */}
        <Link
          href={`/blog/${post.slug}`}
          className="before:absolute before:inset-0 before:rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {post.title}
        </Link>
      </h2>

      <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{post.excerpt}</p>

      <div className="mt-auto flex flex-col gap-5 pt-7">
        <p className="text-[11.5px] text-faint">
          {formatGregorian(post.publishedAt)} · {readingMinutes(post)} min read
        </p>

        <div className="border-t border-line-soft pt-5">
          <span
            aria-hidden
            className={cn(buttonStyles("primary", "sm"), "group-hover:bg-brand-bright")}
          >
            Read article
          </span>
        </div>
      </div>
    </article>
  );
}
