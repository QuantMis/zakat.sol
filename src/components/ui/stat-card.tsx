import { cn } from "@/lib/cn";

type StatCardProps = {
  label: string;
  value: string;
  tone?: "default" | "muted" | "brand";
};

const tones = {
  default: { card: "border-line bg-cream", label: "text-muted", value: "text-ink" },
  muted: { card: "border-line bg-cream", label: "text-muted", value: "text-muted" },
  brand: { card: "border-brand/30 bg-brand/[0.07]", label: "text-brand", value: "text-brand" },
} as const;

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const styles = tones[tone];

  return (
    <div className={cn("flex flex-col gap-2 rounded-[14px] border p-5", styles.card)}>
      <span className={cn("text-[13px]", styles.label)}>{label}</span>
      <span
        className={cn(
          "tabular-nums text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]",
          styles.value,
        )}
      >
        {value}
      </span>
    </div>
  );
}
