"use client";

import { cn } from "@/lib/cn";

type SegmentedProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
  fill?: boolean;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  fill = false,
}: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex gap-2", className)}>
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
              "rounded-[9px] px-3 py-2.5 text-[13px] transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              fill && "flex-1 text-center",
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
