/**
 * The published work the calculator's method is read off. Nothing here is our
 * own ruling. Three entries, which is exactly one row of the landing page grid.
 */

export type Reference = {
  name: string;
  url: string;
  /** The body's own mark. */
  logo: {
    /** A file in `public/logos`, cropped to its own artwork with no frame around it. */
    src: string;
    /** The artwork's own proportions, so the card does not reflow once it lands. */
    width: number;
    height: number;
    /**
     * How tall to draw it, in px. Set by eye, the way `partners.ts` does it: a
     * round emblem (IIFA) has to be drawn taller than a horizontal lockup to
     * read as the same size, and a lockup that stacks two lines of type under
     * its mark (NZF, Selangor) needs back the height that second line eats.
     */
    markHeight: number;
  };
};

export const references: Reference[] = [
  {
    name: "International Islamic Fiqh Academy",
    url: "https://iifa-aifi.org/en",
    logo: { src: "/logos/iifa.png", width: 141, height: 141, markHeight: 34 },
  },
  {
    name: "National Zakat Foundation",
    url: "https://nzf.org.uk/knowledge",
    logo: { src: "/logos/nzf.svg", width: 165, height: 49, markHeight: 30 },
  },
  {
    name: "Lembaga Zakat Selangor",
    url: "https://www.zakatselangor.com.my",
    logo: { src: "/logos/lembaga-zakat-selangor.png", width: 500, height: 167, markHeight: 28 },
  },
];
