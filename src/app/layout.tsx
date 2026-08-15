import type { Metadata } from "next";

import "./globals.css";

// Proxima Nova is licensed through Adobe Fonts, so it can't be self-hosted via
// next/font. Swap in the kit ID from fonts.adobe.com -> Web Projects; the kit
// must publish Regular (400) and Extrabold (800) for the weights we use.
const ADOBE_FONTS_KIT_ID = "XXXXXXX";

export const metadata: Metadata = {
  title: {
    default: "Solana Zakat Calculator",
    template: "%s · Solana Zakat Calculator",
  },
  description:
    "Read-only zakat calculator for Solana wallets: prices SOL and SPL holdings, checks them against the nisab, and exports a report.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={`https://use.typekit.net/${ADOBE_FONTS_KIT_ID}.css`} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
