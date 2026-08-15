/**
 * What earlier years cost to open, and where payment lands.
 *
 * The treasury is public by necessity: a payer's wallet has to be told the
 * recipient to build the transfer, so it ships to the browser and every payment
 * to it is on-chain and permanent. It should be an account kept for this and
 * nothing else.
 */

/** Priced in SOL rather than USD, so the figure quoted is the figure sent. */
export const PREMIUM_PRICE_SOL = 0.05;

/** Empty until it is set, which the paywall reports rather than working around. */
export const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS ?? "";
