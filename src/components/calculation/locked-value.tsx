import { LockIcon } from "@/components/ui/lock-icon";

/**
 * Placeholder digits rather than the real figure blurred. A blur is a CSS rule
 * and comes off in one devtools click, so the number it hides must not be in
 * the markup to begin with — the width is the only thing borrowed from it.
 */
const MASK = "$00,000.00";

/**
 * A figure that has not been paid for. Not interactive itself: the row it sits
 * in carries the click, so there is one target rather than three.
 */
export function LockedValue({ className }: { className?: string }) {
  return (
    <span className={`flex items-center justify-end gap-1.5 ${className ?? ""}`}>
      <LockIcon className="size-3.5 shrink-0 text-faint" />
      <span aria-hidden className="tabular-nums blur-[5px] select-none">
        {MASK}
      </span>
      <span className="sr-only">Locked</span>
    </span>
  );
}
