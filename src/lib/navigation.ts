export const dashboardNav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/calculation", label: "Calculation" },
  { href: "/nisab", label: "Nisab & dates" },
  { href: "/history", label: "History" },
] as const;

/**
 * Public pages reachable from the site header. An item with `wordmark` renders a
 * partner's own lockup instead of text; `label` stays on as its accessible name.
 */
export const marketingNav = [
  { href: "/blog", label: "Blog" },
  {
    href: "/sanctum",
    label: "Sanctum",
    wordmark: { src: "/sanctum-wordmark.png", width: 133, height: 26 },
  },
] as const;

/** Links without an `href` are labels for work that has no page yet. */
export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Calculator", href: "/portfolio" },
      { label: "Nisab tracker", href: "/nisab" },
      { label: "Sanctum stake", href: "/sanctum" },
    ],
  },
  {
    title: "Rulings",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Methodology", href: "/blog/pricing-a-solana-wallet" },
      { label: "Scholar council" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms" }, { label: "Contact" }],
  },
] as const;
