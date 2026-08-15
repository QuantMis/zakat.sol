import type { AssetCategory } from "@/lib/types";

/**
 * Which treatment rule a mint falls under. No price feed carries this — it is a
 * judgement about what a token *is*, so it is curated by hand and checked
 * against Jupiter's verified list rather than typed from memory.
 *
 * Liquid staking tokens sit under `sol` on purpose: the Sanctum page treats a
 * stake as SOL that happens to be working, not as a separate asset class.
 */
export const MINT_CATEGORIES: Record<string, AssetCategory> = {
  // SOL and the liquid staking tokens that stand in for it.
  "So11111111111111111111111111111111111111112": "sol",
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn": "sol", // JitoSOL
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "sol", // mSOL
  "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1": "sol", // bSOL
  "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm": "sol", // INF
  "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A": "sol", // hSOL
  "Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ": "sol", // dSOL
  "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v": "sol", // JupSOL
  "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85": "sol", // BNSOL

  // Fiat-denominated, counted at face value when the rule allows.
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "stablecoin", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "stablecoin", // USDT
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": "stablecoin", // PYUSD
  "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA": "stablecoin", // USDS
  "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT": "stablecoin", // USDe
  "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u": "stablecoin", // FDUSD
  "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH": "stablecoin", // USDG
  "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr": "stablecoin", // EURC
  "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB": "stablecoin", // USD1

  // Protocol tokens, treatable as trade goods.
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "governance", // JUP
  "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL": "governance", // JTO
  "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3": "governance", // PYTH
  "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ": "governance", // W
  "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE": "governance", // ORCA
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "governance", // RAY
  "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7": "governance", // DRIFT
  "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS": "governance", // KMNO
  "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6": "governance", // TNSR
  "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey": "governance", // MNDE
  "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL": "governance", // MET
  "MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u": "governance", // ME
  "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof": "governance", // RENDER
  "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K": "governance", // IO
  "LAYER4xPpTCb3QL8S9u41EAhAX7mhBn8Q6xMTwY2Yzc": "governance", // LAYER
  "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp": "governance", // FIDA
  "J6pQQ3FAcJQeWPPGppWRb4nM8jU3wLyYbRrLh7feMfvd": "governance", // 2Z
  "bioJ9JTqW62MLz7UKHU69gtKhPpGi1BQhccj2kmSvUJ": "governance", // BIO
  "FQgtfugBdpFN7PZ6NdPrZpVLDBrPGxXesi4gVu3vErhY": "governance", // BMT
  "WLFinEv6ypjkczcS83FZqFpgFZYwQXutRbxGe7oC16g": "governance", // WLFI
  "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn": "governance", // PUMP
};

/**
 * An unmapped mint is counted, not excluded. `memecoin` carries no opt-out
 * rule, so an unrecognised token stays in the calculation — the safe direction
 * to be wrong in when the result is what someone owes.
 */
export const DEFAULT_CATEGORY: AssetCategory = "memecoin";

export function categoryFor(mint: string): AssetCategory {
  return MINT_CATEGORIES[mint] ?? DEFAULT_CATEGORY;
}
