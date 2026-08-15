import Link from "next/link";

import { cn } from "@/lib/cn";
import type { PostTopic } from "@/lib/types";

type TopicFilterProps = {
  active: PostTopic | null;
  total: number;
  topics: Array<{ topic: PostTopic; label: string; count: number }>;
};

/**
 * Links rather than local state, so a filtered view is a real URL the reader
 * can share and the crawler can follow.
 */
export function TopicFilter({ active, total, topics }: TopicFilterProps) {
  const entries = [
    { href: "/blog", label: "All", count: total, selected: active === null },
    ...topics.map((entry) => ({
      href: `/blog?topic=${entry.topic}`,
      label: entry.label,
      count: entry.count,
      selected: active === entry.topic,
    })),
  ];

  return (
    <nav aria-label="Filter by topic" className="flex flex-wrap gap-2">
      {entries.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          aria-current={entry.selected ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] transition-colors",
            entry.selected
              ? "border-brand bg-brand/10 font-medium text-brand"
              : "border-line text-muted hover:border-ink/20 hover:text-ink",
          )}
        >
          {entry.label}
          <span
            className={cn("text-[11px]", entry.selected ? "text-brand/70" : "text-faint")}
          >
            {entry.count}
          </span>
        </Link>
      ))}
    </nav>
  );
}
