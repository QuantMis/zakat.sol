"use client";

import { cn } from "@/lib/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  title?: string;
};

export function Toggle({ checked, onChange, label, disabled, title }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[23px] w-10 shrink-0 rounded-full transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        disabled && "cursor-not-allowed opacity-50",
        checked ? "bg-brand" : "bg-mint",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] size-[17px] rounded-full transition-all",
          checked ? "left-[20px] bg-white" : "left-[3px] bg-faint",
        )}
      />
    </button>
  );
}
