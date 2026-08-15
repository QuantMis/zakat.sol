import { cn } from "@/lib/cn";

export function StatusChip({ status }: { status: "due" | "paid" }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold",
        status === "due" ? "bg-brand/12 text-brand" : "bg-ink/[0.06] text-muted",
      )}
    >
      {status === "due" ? "Due" : "Marked paid"}
    </span>
  );
}
