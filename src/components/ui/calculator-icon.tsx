/** Line-drawn calculator. Decorative — the control it sits in carries the label. */
export function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="4.5"
        y="2.5"
        width="15"
        height="19"
        rx="2.75"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="8"
        y="6"
        width="8"
        height="3.25"
        rx="1.1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <g fill="currentColor">
        <circle cx="8.75" cy="13.5" r="1.1" />
        <circle cx="12" cy="13.5" r="1.1" />
        <circle cx="15.25" cy="13.5" r="1.1" />
        <circle cx="8.75" cy="17.5" r="1.1" />
        <circle cx="12" cy="17.5" r="1.1" />
        <circle cx="15.25" cy="17.5" r="1.1" />
      </g>
    </svg>
  );
}
