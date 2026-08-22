"use client";

import { cn } from "@/lib/cn";

/** `sm` is for the token cards, which sit four across a desktop row. */
const SIZES = {
  sm: "gap-0.5 [&>button]:rounded-[7px] [&>button]:px-2 [&>button]:py-1 [&>button]:text-[11.5px]",
  md: "gap-2 [&>button]:rounded-[9px] [&>button]:px-3 [&>button]:py-2.5 [&>button]:text-[13px]",
} as const;

type SegmentedProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
  size?: keyof typeof SIZES;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  size = "md",
}: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex", SIZES[size], className)}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              selected ? "bg-mint text-ink" : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
