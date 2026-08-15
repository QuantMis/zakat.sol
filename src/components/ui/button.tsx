import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light" | "quiet";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-bright",
  outline: "border border-line text-ink hover:border-ink/30 hover:bg-ink/[0.02]",
  light: "bg-white text-brand-deep hover:bg-white/90",
  quiet: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-[12.5px]",
  md: "px-5 py-3 text-[14.5px]",
  lg: "px-6 py-4 text-base",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2.5 rounded-[10px] font-semibold transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles(variant, size), className)} {...props} />;
}
