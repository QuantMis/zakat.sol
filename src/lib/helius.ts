import type { Holding, HoldingsSnapshot } from "@/lib/types";

/**
 * Helius' DAS API answers the whole balance question in one call: every
 * fungible mint an address holds, with the metadata needed to name it and the
 * decimals needed to scale it.
 *
 * Prices are deliberately not taken from here. DAS returns them under
 * `token_info.price_info`, but the price feed is never to be told whose wallet
 * is being priced — so pricing stays a separate request about mints alone, and
 * this field is ignored.
 *
 * The key must never reach the browser. Only the route handler at
 * `src/app/api/holdings/route.ts` imports this module.
 */

const RPC_URL = "https://mainnet.helius-rpc.com";

/** The REST side, which is where the historical balance endpoints live. */
const WALLET_URL = "https://api.helius.xyz/v1/wallet";

/** DAS caps a page at 1000 assets and counts pages from 1. */
const PAGE_SIZE = 1000;

/** Past this the address is a program or an airdrop dump, not a portfolio. */
const MAX_PAGES = 10;

export const SOL_MINT = "So11111111111111111111111111111111111111112";
const LAMPORTS_PER_SOL = 1_000_000_000;

type DasTokenInfo = {
  symbol?: string;
  /** In base units — divide by `10 ** decimals` to get a human balance. */
  balance?: number;
  decimals?: number;
};

type DasAsset = {
  /** The mint address. */
  id: string;
  content?: { metadata?: { name?: string; symbol?: string } };
  token_info?: DasTokenInfo;
};

type DasNativeBalance = { lamports?: number };

type DasResult = {
  items?: DasAsset[];
  nativeBalance?: DasNativeBalance;
};

type DasResponse = {
  result?: DasResult;
  error?: { code: number; message: string };
};

function apiKey(): string {
  const key = process.env.HELIUS_API_KEY;

  if (!key) {
    throw new Error("HELIUS_API_KEY is not set. Copy .env.example to .env.");
  }

  return key;
}

/**
 * `searchAssets` rather than `getAssetsByOwner`, because only the former
 * accepts `tokenType` — the latter rejects it outright and would hand back
 * every NFT in the wallet for us to discard client-side.
 */
async function searchAssets(address: string, page: number): Promise<DasResult> {
  const response = await fetch(`${RPC_URL}/?api-key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Balances change every slot, so there is nothing here worth caching.
    cache: "no-store",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "holdings",
      method: "searchAssets",
      params: {
        ownerAddress: address,
        page,
        limit: PAGE_SIZE,
        // Drops NFTs — zakat on collectibles is a different ruling and a
        // different screen. Covers both SPL and Token-2022 mints.
        tokenType: "fungible",
        options: {
          showNativeBalance: true,
          // Closed positions and empty token accounts are not holdings.
          showZeroBalance: false,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Helius returned ${response.status} ${response.statusText}.`);
  }

  const payload = (await response.json()) as DasResponse;

  // JSON-RPC reports failure in the body with a 200 status, so this cannot be
  // folded into the `response.ok` check above.
  if (payload.error) {
    throw new Error(`Helius: ${payload.error.message}`);
  }

  return payload.result ?? {};
}

/**
 * In practice the symbol arrives under `content.metadata`, not `token_info` —
 * the latter is frequently absent on live responses. Plain SPL mints carry no
 * metadata at all, so falling back to a truncated mint keeps the row
 * identifiable instead of blank; the dust rules decide whether it is worth
 * showing at all.
 */
function toHolding(asset: DasAsset): Holding | null {
  const info = asset.token_info;

  if (typeof info?.balance !== "number" || typeof info.decimals !== "number") return null;
  if (info.balance <= 0) return null;

  const metadata = asset.content?.metadata;

  return {
    mint: asset.id,
    symbol: metadata?.symbol || info.symbol || `${asset.id.slice(0, 4)}…`,
    name: metadata?.name || metadata?.symbol || "Unknown token",
    balance: info.balance / 10 ** info.decimals,
    decimals: info.decimals,
  };
}

/**
 * Native SOL lives in the account itself rather than a token account, so DAS
 * reports it beside the list instead of in it. The app treats it as a holding
 * like any other, under the wrapped-SOL mint that every price feed quotes.
 */
function nativeHolding(native: DasNativeBalance | undefined): Holding | null {
  const lamports = native?.lamports;

  if (typeof lamports !== "number" || lamports <= 0) return null;

  return {
    mint: SOL_MINT,
    symbol: "SOL",
    name: "Solana",
    balance: lamports / LAMPORTS_PER_SOL,
    decimals: 9,
  };
}

type BalanceAtResponse = { balance?: string };

/**
 * What the address held of one mint at one moment, already scaled out of base
 * units. Helius resolves a timestamp to the nearest slot against its archive.
 *
 * Null rather than zero when the read fails: a mint that could not be read is
 * not a mint that was empty, and a rebuilt year should say so.
 *
 * Native SOL is not covered — it lives in the account rather than a token
 * account, and this endpoint answers 0 for the wrapped mint. See
 * `nativeBalanceAt`.
 */
export async function balanceAt(address: string, mint: string, at: Date): Promise<number | null> {
  const seconds = Math.floor(at.getTime() / 1000);
  const url = `${WALLET_URL}/${address}/balance-at?mint=${mint}&time=${seconds}&api-key=${apiKey()}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const { balance } = (await response.json()) as BalanceAtResponse;
  const value = Number(balance);

  return Number.isFinite(value) ? value : null;
}

type RpcTransaction = {
  blockTime?: number;
  transaction?: { message?: { accountKeys?: (string | { pubkey?: string })[] } };
  meta?: { postBalances?: number[] };
};

type TransactionsResponse = {
  result?: { data?: RpcTransaction[] };
  error?: { message: string };
};

/**
 * Native SOL at a past moment, read off the last transaction the address landed
 * before it: a transaction records every account's balance as it left it, so
 * the most recent post-balance before a date is the balance on that date.
 *
 * Null when the archive has nothing before then, which for a wallet means it
 * did not exist yet — distinct from a wallet that held nothing.
 */
export async function nativeBalanceAt(address: string, at: Date): Promise<number | null> {
  const response = await fetch(`${RPC_URL}/?api-key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "native-balance",
      method: "getTransactionsForAddress",
      params: [
        address,
        {
          transactionDetails: "full",
          // Newest first, capped at one: the transaction wanted is the last one
          // before the date, and everything older is irrelevant.
          sortOrder: "desc",
          limit: 1,
          encoding: "jsonParsed",
          maxSupportedTransactionVersion: 0,
          // A failed transaction still records balances, but they are the ones
          // that were rolled back.
          filters: { blockTime: { lte: Math.floor(at.getTime() / 1000) }, status: "succeeded" },
        },
      ],
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as TransactionsResponse;
  if (payload.error) return null;

  const [transaction] = payload.result?.data ?? [];
  const keys = transaction?.transaction?.message?.accountKeys ?? [];
  const balances = transaction?.meta?.postBalances ?? [];

  const index = keys.findIndex((key) => (typeof key === "string" ? key : key.pubkey) === address);
  if (index === -1 || typeof balances[index] !== "number") return null;

  return balances[index] / LAMPORTS_PER_SOL;
}

type BlockhashResponse = { result?: { value?: { blockhash?: string } } };

/**
 * A blockhash to build a transaction against. Fetched here rather than in the
 * browser so the node URL — which carries the key — stays on this side.
 */
export async function latestBlockhash(): Promise<string> {
  const response = await fetch(`${RPC_URL}/?api-key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "blockhash",
      method: "getLatestBlockhash",
      params: [{ commitment: "finalized" }],
    }),
  });

  if (!response.ok) throw new Error(`Helius returned ${response.status}.`);

  const blockhash = ((await response.json()) as BlockhashResponse).result?.value?.blockhash;
  if (!blockhash) throw new Error("Helius returned no blockhash.");

  return blockhash;
}

type ParsedInstruction = { program?: string; parsed?: unknown };

type FetchedTransaction = {
  result?: {
    meta?: {
      err?: unknown;
      preBalances?: number[];
      postBalances?: number[];
      logMessages?: string[];
      innerInstructions?: { instructions?: ParsedInstruction[] }[];
    };
    transaction?: {
      message?: {
        accountKeys?: (string | { pubkey?: string })[];
        instructions?: ParsedInstruction[];
      };
    };
  };
  error?: { message: string };
};

/** Just enough of a transaction to decide whether it paid for something. */
export type PaymentTransaction = {
  failed: boolean;
  /** Base58 of the fee payer, which for a plain transfer is the sender. */
  payer: string;
  /** Every memo the transaction carried, in the order they appear. */
  memos: string[];
  /** Lamports an account gained, which for the treasury is what it was paid. */
  creditedTo: (address: string) => number;
};

function pubkeyOf(key: string | { pubkey?: string }): string {
  return typeof key === "string" ? key : (key.pubkey ?? "");
}

/**
 * A confirmed transaction, or null while the chain has not caught up with the
 * signature yet. Parsed rather than raw so a memo reads as its text.
 */
export async function fetchTransaction(signature: string): Promise<PaymentTransaction | null> {
  const response = await fetch(`${RPC_URL}/?api-key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "payment",
      method: "getTransaction",
      params: [
        signature,
        { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" },
      ],
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as FetchedTransaction;
  if (payload.error || !payload.result) return null;

  const { meta, transaction } = payload.result;
  const keys = (transaction?.message?.accountKeys ?? []).map(pubkeyOf);

  const instructions = [
    ...(transaction?.message?.instructions ?? []),
    ...(meta?.innerInstructions ?? []).flatMap((inner) => inner.instructions ?? []),
  ];

  const memos = instructions
    .filter((instruction) => instruction.program === "spl-memo")
    .map((instruction) => String(instruction.parsed ?? ""));

  return {
    failed: meta?.err != null,
    payer: keys[0] ?? "",
    memos,
    creditedTo: (address) => {
      const index = keys.indexOf(address);
      if (index === -1) return 0;

      const before = meta?.preBalances?.[index] ?? 0;
      const after = meta?.postBalances?.[index] ?? 0;

      return after - before;
    },
  };
}

/**
 * Every fungible mint the address holds, native SOL first. Throws when Helius
 * is unreachable or rejects the request — the caller decides what the portfolio
 * screen says about it.
 */
export async function fetchHoldings(address: string): Promise<HoldingsSnapshot> {
  const holdings: Holding[] = [];
  let native: DasNativeBalance | undefined;

  // Pagination is sequential by nature: the last page is only recognisable once
  // it comes back short.
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await searchAssets(address, page);
    const items = result.items ?? [];

    // Only the first page carries the native balance.
    native ??= result.nativeBalance;

    for (const item of items) {
      const holding = toHolding(item);
      if (holding) holdings.push(holding);
    }

    if (items.length < PAGE_SIZE) break;
  }

  const sol = nativeHolding(native);

  return {
    address,
    scannedAt: new Date().toISOString(),
    // Wrapped SOL shares this mint, so a wallet holding both reports it twice.
    // Left as read here — `scanPortfolio` adds the two together.
    holdings: sol ? [sol, ...holdings] : holdings,
  };
}
