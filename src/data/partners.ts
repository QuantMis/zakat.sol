/**
 * Who the calculator leans on: balances from one service, prices from another,
 * the archive that values a hawl that closed years ago, the wallet it connects
 * through, and the foundation behind the chain all of it reads.
 */

export type Partner = {
  name: string;
  /** A file in `public/logos`, cropped to its own artwork with no frame around it. */
  logo: string;
  /**
   * The logo's own proportions. Only the ratio is read off these — the mark is
   * drawn to `markHeight` — but both are given so the row does not reflow once
   * the images land.
   */
  width: number;
  height: number;
  /**
   * How tall to draw it, in px. Set by eye rather than shared, because these
   * lockups put different amounts of height above and below their wordmark: a
   * tall mark next to small type (DefiLlama) or a name set on two lines (Solana
   * Foundation) reads far smaller than a one-line wordmark at the same height.
   * Matching the type, not the bounding box, is what makes the row look even.
   */
  markHeight: number;
};

export const partners: Partner[] = [
  {
    name: "Helius",
    logo: "/logos/helius.svg",
    width: 1910,
    height: 411,
    markHeight: 22,
  },
  {
    name: "Jupiter",
    logo: "/logos/jupiter.svg",
    width: 1169,
    height: 316,
    markHeight: 25,
  },
  {
    name: "DefiLlama",
    logo: "/logos/defillama.png",
    width: 469,
    height: 160,
    markHeight: 30,
  },
  {
    name: "Phantom",
    logo: "/logos/phantom.svg",
    width: 1511,
    height: 305,
    markHeight: 24,
  },
  {
    name: "Solana Foundation",
    logo: "/logos/solana-foundation.svg",
    width: 1488,
    height: 253,
    markHeight: 27,
  },
];
