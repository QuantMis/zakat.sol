/** Line-drawn padlock. Decorative — the control it sits in carries the label. */
export function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="4.5"
        y="10.5"
        width="15"
        height="11"
        rx="2.75"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10.5V7.5a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}
