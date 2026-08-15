import type { PortfolioSnapshot } from "@/lib/types";

/**
 * Sample scan used until a wallet adapter is wired in. Prices are the ones
 * quoted in the design; swap this module for a live RPC + price feed and
 * nothing downstream has to change.
 */
export const portfolio: PortfolioSnapshot = {
  address: "5wLEKq3PZ8mXmDe3tCE9xhtT6dCTgTBcAj7bJZ2NrsWw",
  domain: "musa.sol",
  scannedAt: "2026-08-15T12:47:00.000Z",
  assets: [
    {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      name: "Solana",
      category: "sol",
      balance: 142.61,
      price: 178.4,
      displayDecimals: 3,
    },
    {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      name: "USD Coin",
      category: "stablecoin",
      balance: 4820,
      price: 1,
      displayDecimals: 2,
    },
    {
      mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
      symbol: "JTO",
      name: "Jito",
      category: "governance",
      balance: 1150,
      price: 2.94,
      displayDecimals: 2,
    },
    {
      mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      symbol: "JUP",
      name: "Jupiter",
      category: "governance",
      balance: 3240,
      price: 0.87,
      displayDecimals: 2,
    },
    {
      mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      symbol: "BONK",
      name: "Bonk",
      category: "memecoin",
      balance: 42_600_000,
      price: 0.0000412,
      displayDecimals: 2,
    },
    {
      mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
      symbol: "PYTH",
      name: "Pyth Network",
      category: "governance",
      balance: 8400,
      price: 0.196,
      displayDecimals: 2,
    },
  ],
  dust: {
    mintCount: 25,
    value: 18.44,
  },
};

export const solPrice =
  portfolio.assets.find((asset) => asset.symbol === "SOL")?.price ?? 0;

/** Total mints held, including the ones no price feed covers. */
export const detectedMintCount = portfolio.assets.length + portfolio.dust.mintCount;
