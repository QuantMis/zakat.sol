/**
 * The Solana wordless mark, in the chain's own gradient rather than the app's
 * green — it identifies a network here, so it should not read as our badge.
 * The gradient id is namespaced because more than one of these can share a page.
 */
export function SolanaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 21" aria-hidden className={className}>
      <defs>
        <linearGradient id="solana-mark" x1="0" y1="21" x2="24" y2="0">
          <stop offset="0" stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <g fill="url(#solana-mark)">
        <path d="M4 1h20l-4 5H0z" />
        <path d="M0 8h20l4 5H4z" />
        <path d="M4 15h20l-4 5H0z" />
      </g>
    </svg>
  );
}
