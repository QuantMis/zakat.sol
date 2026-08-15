/**
 * The published work the calculator's method is read off. Nothing here is our
 * own ruling. Six entries, which is what fills the grid on the landing page.
 */

export type Reference = {
  name: string;
  url: string;
};

export const references: Reference[] = [
  { name: "AAOIFI Shari'ah Standard No. 35", url: "https://aaoifi.com/shariaa-standards/?lang=en" },
  { name: "International Islamic Fiqh Academy", url: "https://iifa-aifi.org/en" },
  { name: "Assembly of Muslim Jurists of America", url: "https://www.amjaonline.org" },
  { name: "National Zakat Foundation", url: "https://nzf.org.uk/knowledge" },
  { name: "Amanah Advisors", url: "https://www.amanahadvisors.com" },
  { name: "Simple Zakat Guide", url: "https://joebradford.net/simple-zakat-guide" },
];
