"use client";

import { cn } from "@/lib/cn";

type RadioCardProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
};

export function RadioCard({ selected, onSelect, title, detail }: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[11px] border p-4 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        selected
          ? "border-brand bg-mint-soft"
          : "border-line bg-cream-soft hover:border-ink/20",
      )}
    >
      <span
        className={cn(
          "size-[18px] shrink-0 rounded-full border-2 transition-all",
          selected ? "border-[5px] border-brand bg-white" : "border-[#A9B3AB]",
        )}
      />
      <span className="flex flex-col gap-0.5">
        <span className={cn("text-[14.5px] font-semibold", !selected && "text-ink-soft")}>
          {title}
        </span>
        <span className={cn("font-mono text-[11.5px]", selected ? "text-muted" : "text-faint")}>
          {detail}
        </span>
      </span>
    </button>
  );
}
