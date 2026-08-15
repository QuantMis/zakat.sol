import { cn } from "@/lib/cn";

/** The eight-point star that stands in for the brand mark. */
export function Star({ className }: { className?: string }) {
  return <span aria-hidden className={cn("star inline-block bg-brand", className)} />;
}
