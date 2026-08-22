import type { Post } from "@/lib/types";
import { DUST_THRESHOLD_USD, NISAB_GRAMS, ZAKAT_RATE } from "@/lib/zakat";

const rate = `${ZAKAT_RATE * 100}%`;

/**
 * Editorial content. Written here rather than in MDX because every post is
 * short and several of them quote the same constants the calculator uses —
 * change `ZAKAT_RATE` and the prose follows.
 */
export const posts: Post[] = [
  {
    slug: "pricing-a-solana-wallet",
    title: "How the scan prices a Solana wallet",
    topic: "product",
    publishedAt: "2026-08-04T00:00:00.000Z",
    excerpt:
      "Every figure in your report comes out of three passes over one address: what you hold, what it is worth, and what actually counts. Here is each pass, and where it can be wrong.",
    body: [
      { kind: "heading", text: "Pass one — what you hold" },
      {
        kind: "paragraph",
        text: "The scan asks an RPC node for your native SOL balance and for every SPL token account the address owns. That gives a mint address, a raw balance and the decimals to divide it by. Nothing is inferred and nothing is remembered between scans: two runs a minute apart are two independent reads of the chain.",
      },
      {
        kind: "paragraph",
        text: "A wallet that has ever touched an airdrop usually owns far more token accounts than its owner realises. Most hold a balance worth a fraction of a cent. They are still read, still priced, and still shown — collapsed into one line rather than dropped silently.",
      },
      { kind: "heading", text: "Pass two — what it is worth" },
      {
        kind: "paragraph",
        text: "Each mint is quoted once, at scan time, in USD. Not a daily average and not the price when you bought it: the number a buyer would have paid at the moment you ran the scan. That timestamp is printed on the report, because a report without one cannot be checked later.",
      },
      {
        kind: "list",
        items: [
          "SOL and the large-cap SPL tokens are priced from a market feed.",
          "Stablecoins are carried at face value unless you switch that rule off.",
          "Mints with no liquid route to price are worth nothing the scan can defend, so they go to the dust line rather than into the total.",
        ],
      },
      {
        kind: "note",
        title: "The dust line",
        text: `Balances under $${DUST_THRESHOLD_USD} are grouped into a single row with a mint count. You can fold them into the calculation or leave them out — but you always see the figure, because "too small to matter" is a judgement for the person paying, not for the tool.`,
      },
      { kind: "heading", text: "Pass three — what counts" },
      {
        kind: "paragraph",
        text: "The priced list then meets your treatment rules: how stablecoins are valued, whether governance tokens are held as trade goods, what happens to dust, and any mint you excluded by hand. What survives is your gross zakatable wealth. Debts you entered come off it, and the remainder is checked against the nisab.",
      },
      {
        kind: "paragraph",
        text: `Only if the remainder clears the nisab is anything due, and then it is ${rate} of the remainder. Below the threshold the answer is zero — not a small number, zero.`,
      },
      {
        kind: "note",
        title: "Change what counts, change the answer",
        text: "Any holding can be switched out of the calculation on the portfolio screen, and the report recalculates the moment you do.",
        href: "/calculation",
        linkLabel: "Open the portfolio",
      },
    ],
  },
  {
    slug: "gold-or-silver-nisab",
    title: "Gold or silver: which nisab applies to you?",
    topic: "rulings",
    publishedAt: "2026-07-21T00:00:00.000Z",
    excerpt:
      "Two thresholds, both classical, and today they are nowhere near each other. Choosing between them is the single setting that most often decides whether you owe anything at all.",
    body: [
      {
        kind: "paragraph",
        text: `The nisab is the floor beneath which no zakat is due. It was fixed in metal, not in currency: ${NISAB_GRAMS.gold} grams of gold, or ${NISAB_GRAMS.silver} grams of silver. In the period the rulings come from, the two were worth roughly the same. They have not been for a long time.`,
      },
      {
        kind: "paragraph",
        text: "Priced today, the silver threshold is a fraction of the gold one. Which you pick decides whether a modest portfolio is above the line or below it — and for most crypto holders, that is the whole question.",
      },
      { kind: "heading", text: "The case for silver" },
      {
        kind: "paragraph",
        text: "The lower threshold captures more people, which means more zakat reaches those entitled to it. Scholars who favour it argue the point of the nisab is to identify surplus wealth, and the silver figure tracks the modest surplus the ruling was describing better than gold now does.",
      },
      { kind: "heading", text: "The case for gold" },
      {
        kind: "paragraph",
        text: "Gold has held its purchasing power far more steadily. On this view the silver threshold no longer marks meaningful surplus at all — it would oblige people who are, in any practical sense, not wealthy. Gold keeps the threshold where the ruling intended it.",
      },
      {
        kind: "note",
        title: "What this calculator does",
        text: "This calculator uses gold, because it is the more common contemporary position — not because it is the safer one. The silver threshold is lower, so it catches wallets gold would let past.",
      },
      { kind: "heading", text: "Pick one and stay with it" },
      {
        kind: "paragraph",
        text: "The failure mode is not choosing wrong. It is choosing gold in a strong year and silver in a weak one, which is not a position — it is arithmetic in your own favour. Settle the question once, ideally with someone qualified who knows your circumstances, and hold it across years.",
      },
    ],
  },
  {
    slug: "liquid-staking-and-zakat",
    title: "Liquid staking tokens and the zakat on yield",
    topic: "rulings",
    publishedAt: "2026-06-30T00:00:00.000Z",
    excerpt:
      "Staked SOL comes back to you as a token whose price quietly grows. That design decides how the yield is counted — and why there is no separate rewards line in your report.",
    body: [
      {
        kind: "paragraph",
        text: "Stake SOL through a liquid staking protocol and you receive an LST: a token representing your share of a stake pool. You keep something liquid and transferable while the SOL underneath keeps validating.",
      },
      { kind: "heading", text: "The yield is already in the price" },
      {
        kind: "paragraph",
        text: "Most LSTs do not pay rewards to you. Rewards accrue to the pool, and each token becomes redeemable for slightly more SOL than it was yesterday. Your balance never changes; the redemption rate does. So when the scan prices the token at market, the accumulated yield is already inside that number.",
      },
      {
        kind: "paragraph",
        text: "That is why the report shows no separate staking rewards line. Adding one would count the same growth twice.",
      },
      {
        kind: "note",
        title: "Rebasing tokens are the exception",
        text: "A few designs mint new tokens to you instead of raising the redemption rate. There the balance grows and the price does not — still counted once, just on the other side of the multiplication.",
      },
      { kind: "heading", text: "Does the lock-up defer anything?" },
      {
        kind: "paragraph",
        text: "No. Native unstaking waits for the end of an epoch, and pool withdrawals can queue. Neither takes the wealth out of your hands: it is yours, it is measurable, and a delay in reaching it is not the same as not owning it. The classical parallel is a debt you are confident of collecting — it counts.",
      },
      { kind: "heading", text: "Where scholars differ" },
      {
        kind: "paragraph",
        text: "Some treat staking yield as income, due when received rather than folded into a year-end valuation. In practice the two approaches converge for anyone holding across a full hawl, and diverge for someone who stakes and exits inside one. If you move in and out often, this is worth asking about specifically.",
      },
      {
        kind: "note",
        title: "Staking through Sanctum",
        text: "The Sanctum page prices a stake against the nisab, projects one hawl of yield and shows how each LST is treated in the report.",
        href: "/sanctum",
        linkLabel: "Open the Sanctum page",
      },
    ],
  },
  {
    slug: "memecoins-and-the-intention-to-trade",
    title: "Memecoins, airdrops and the intention to trade",
    topic: "rulings",
    publishedAt: "2026-05-19T00:00:00.000Z",
    excerpt:
      "A token you never chose to buy is still a token you own. What decides its treatment is not how it arrived, but what you intend to do with it.",
    body: [
      {
        kind: "paragraph",
        text: "Classical zakat draws a line between wealth held for use and wealth held for trade. A house you live in is not zakatable; the same house bought to resell is. The category is set by intention, and intention is why two identical token balances can be treated differently.",
      },
      { kind: "heading", text: "Held to sell" },
      {
        kind: "paragraph",
        text: "Nearly every token in a Solana wallet is held to sell — eventually, at a better price. That is trade goods, and trade goods are valued at market on the day the hawl completes. Not what you paid, not what you hope for: what it is worth that day.",
      },
      {
        kind: "paragraph",
        text: `Which means an unrealised gain is zakatable. ${rate} of a position you never sold is still due, and a position that has fallen is counted at the lower figure. The report values the wallet the market values it, in both directions.`,
      },
      { kind: "heading", text: "Airdrops you never asked for" },
      {
        kind: "paragraph",
        text: "An airdrop is wealth that arrived. If it has a price and a route to sell, it counts from the moment you can dispose of it. Claiming it later does not reset anything, and neither does leaving it untouched.",
      },
      {
        kind: "list",
        items: [
          "Priced and sellable — counted at market, like everything else.",
          "Unsellable, no liquidity, no route — no defensible value, so it sits in the dust line until that changes.",
          "Locked or vesting — counted when it becomes yours to move, not when it was announced.",
        ],
      },
      {
        kind: "note",
        title: "One caution about source",
        text: "Zakat is a purification of lawful wealth, not a way to launder unlawful wealth. If a holding came from something impermissible, paying zakat on it is not the remedy — disposing of it is. That is a question for a scholar, not a calculator.",
      },
    ],
  },
  {
    slug: "hawl-on-a-moving-wallet",
    title: "Keeping a hawl on a wallet that never sits still",
    topic: "guides",
    publishedAt: "2026-04-08T00:00:00.000Z",
    excerpt:
      "The lunar year runs on your wealth crossing the nisab, not on any single coin. Which is what makes an active wallet far simpler to handle than people expect.",
    body: [
      {
        kind: "paragraph",
        text: "The hawl is the lunar year that has to pass before zakat is due. The common worry is that swapping tokens restarts it — that a wallet trading weekly can never complete one. It does not work that way.",
      },
      { kind: "heading", text: "The clock is on the wealth, not the asset" },
      {
        kind: "paragraph",
        text: "The hawl begins the day your zakatable wealth first crosses the nisab, and it continues as long as it stays above. Selling SOL for USDC changes the shape of the wealth, not its existence. Only dropping below the nisab breaks the year and resets the clock.",
      },
      {
        kind: "paragraph",
        text: "So an active trader and a dormant holder who both stayed above the threshold owe on the same date. The only figure that matters from the whole year is the valuation on the day it closes.",
      },
      { kind: "heading", text: "Fixing the date" },
      {
        kind: "paragraph",
        text: "Pick your anniversary in the Hijri calendar and it will hold. A lunar year is about eleven days shorter than a solar one, so a Gregorian date drifts backwards through the seasons and, roughly every thirty-three years, quietly skips a year of zakat entirely.",
      },
      {
        kind: "list",
        items: [
          "Set the anniversary once and keep it, even if the wallet changes hands or chains.",
          "Record the valuation on the day, not from memory a month later.",
          "If you fall below the nisab mid-year, note the date — that is what restarts the clock.",
        ],
      },
      {
        kind: "note",
        title: "Dates you can check",
        text: "Hijri dates here are computed with the Umm al-Qura calendar and formatted in UTC, so the date on your report is the same date for everyone reading it.",
      },
    ],
  },
  {
    slug: "what-a-read-only-scan-sees",
    title: "What a read-only scan can and cannot see",
    topic: "product",
    publishedAt: "2026-03-02T00:00:00.000Z",
    excerpt:
      "Connecting a wallet to this calculator grants it exactly one thing: your public address. Everything else it knows, anyone with that address already knows.",
    body: [
      {
        kind: "paragraph",
        text: "A wallet connection sounds like access. It is not. The handshake hands over a public key — the same string you would paste into an explorer — and nothing more. No private key ever leaves your wallet, and this app never asks for one.",
      },
      { kind: "heading", text: "What it can see" },
      {
        kind: "list",
        items: [
          "Your public address, and the balances and token accounts under it.",
          "Every transaction that address has ever made, because the ledger is public.",
          "Prices, which come from a market feed and have nothing to do with you.",
        ],
      },
      { kind: "heading", text: "What it cannot do" },
      {
        kind: "list",
        items: [
          "Move funds. Transfers need a signature, and no code here requests one.",
          "Approve a program or set a token delegate. Same reason.",
          "Link the address to you. There is no account, no email required, no login.",
        ],
      },
      {
        kind: "paragraph",
        text: "The strongest guarantee is not a promise in a policy — it is that the app has no code path that builds a transaction. You can verify that by disconnecting your wallet and pasting a public address instead. The report is identical.",
      },
      {
        kind: "note",
        title: "Where your settings live",
        text: "Nowhere. The calculator takes fixed positions rather than remembering preferences, so there is nothing written to your browser and nothing held for you on a server.",
      },
    ],
  },
];
