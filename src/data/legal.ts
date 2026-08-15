import type { LegalSection } from "@/lib/types";
import { STORAGE_KEY } from "@/state/settings-store";

export const privacyUpdatedAt = "2026-08-01T00:00:00.000Z";

export const privacySections: LegalSection[] = [
  {
    id: "summary",
    title: "The short version",
    body: [
      {
        kind: "paragraph",
        text: "zakat.sol reads a public Solana address and prices what it finds. There is no account to create, no password to lose and no server holding your figures. Your settings sit in your own browser, and the calculation runs in front of you.",
      },
      {
        kind: "list",
        items: [
          "We never ask for a private key or a seed phrase, and we never request a signature.",
          "Connecting a wallet shares one thing: a public address anyone could read from the ledger.",
          "Your rules, exclusions, liabilities and hawl date stay on your device.",
          "No advertising, no third-party trackers, no selling anything to anyone.",
        ],
      },
    ],
  },
  {
    id: "what-we-read",
    title: "What the app reads",
    body: [
      {
        kind: "paragraph",
        text: "To produce a report, the app needs your public address and the state of the chain underneath it. Both are public information. It reads your native SOL balance, the SPL token accounts the address owns, and the mint and decimals of each one.",
      },
      {
        kind: "paragraph",
        text: "It then asks a price feed what those mints are worth. That request is about tokens, not about you — the feed is not told whose wallet is being priced.",
      },
      {
        kind: "note",
        title: "You do not have to connect anything",
        text: "Pasting a public address produces exactly the same report as a wallet connection. If you would rather not connect, don't.",
      },
    ],
  },
  {
    id: "your-browser",
    title: "What stays in your browser",
    body: [
      {
        kind: "paragraph",
        text: `Your preferences are written to your browser's localStorage under the key ${STORAGE_KEY}. They never leave the device and are not readable by any other site.`,
      },
      {
        kind: "list",
        items: [
          "Nisab basis, calendar and hawl reminder preferences.",
          "Which treatment rules are on, and any mint you excluded by hand.",
          "Liabilities you typed in, including their labels and amounts.",
        ],
      },
      {
        kind: "paragraph",
        text: "Because this is per-browser storage, your settings do not follow you to another device, and clearing your browser data clears them. That is the trade for not holding them ourselves.",
      },
    ],
  },
  {
    id: "what-we-never-do",
    title: "What the app cannot do",
    body: [
      {
        kind: "list",
        items: [
          "Move funds. A transfer needs a signature, and nothing here builds a transaction to sign.",
          "Approve a program or set a token delegate, for the same reason.",
          "Recover, store or transmit a private key or seed phrase. It never has one.",
          "Tie an address to a name, an email or an identity. There is no account to tie it to.",
        ],
      },
      {
        kind: "paragraph",
        text: "This is a property of the code rather than a promise about our conduct, which is the stronger of the two.",
      },
    ],
  },
  {
    id: "third-parties",
    title: "Third parties in the path",
    body: [
      {
        kind: "paragraph",
        text: "A page load touches a small number of services, and each sees only what it needs to answer:",
      },
      {
        kind: "list",
        items: [
          "An RPC provider, which is asked for balances and therefore sees the address being scanned along with the network metadata any web request carries, such as an IP address.",
          "A price feed, which is asked about mints and is told nothing about the wallet.",
          "Your wallet extension, which decides what to share with a site and can be disconnected at any time from within the extension.",
          "The host serving this site, which keeps ordinary request logs for reliability and abuse handling.",
        ],
      },
      {
        kind: "paragraph",
        text: "Fonts are served from this domain rather than fetched from a font CDN, so loading a page does not announce your visit to a third party.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: [
      {
        kind: "paragraph",
        text: "The app sets no cookies. There is no analytics script, no session replay, no advertising pixel and no fingerprinting. localStorage is used for your settings and nothing else — it holds no identifier for you.",
      },
      {
        kind: "paragraph",
        text: "If you subscribe to the monthly note, the address you type is used to send that note and for nothing else. It is not required to use the calculator, and every send carries an unsubscribe link.",
      },
    ],
  },
  {
    id: "controls",
    title: "Your controls",
    body: [
      {
        kind: "paragraph",
        text: "Because nothing is held on a server, the usual data requests have nothing to act on: there is no file of yours to export, correct or delete. What exists is on your device, and you can clear it here or through your browser's site-data settings.",
      },
      {
        kind: "paragraph",
        text: "Reports you export are files you generate and keep. Once a CSV or a printed PDF is on your machine, it is yours to look after.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: [
      {
        kind: "paragraph",
        text: "If this policy changes, the date at the top of the page changes with it, and material changes will be noted on the blog rather than slipped in quietly.",
      },
      {
        kind: "paragraph",
        text: "Questions about anything here, including how a specific number in your report was produced, are welcome — the calculation is meant to be checkable.",
      },
    ],
  },
];
