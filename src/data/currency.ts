/**
 * The currency zakat is quoted in beside USD. Zakat is paid to a local body in
 * local money, so the figure someone acts on is rarely the dollar one — but
 * every price feed the app reads is denominated in USD, so USD stays the unit
 * the calculation is *done* in and this is a presentation layer over it.
 *
 * Held here as a fixed rate for the same reason `metalPrices` is: it is a
 * quoted figure with a date on it, not something the calculator derives. Swap
 * `code`/`prefix`/`perUsd` together to quote a different currency.
 */
export type LocalCurrency = {
  /** ISO 4217, carried so exports can name the unit unambiguously. */
  code: string;
  /** How the amount is written locally — "RM 129.31", not "MYR 129.31". */
  prefix: string;
  /** Units of this currency to one US dollar. */
  perUsd: number;
  updatedAt: string;
};

export const LOCAL_CURRENCY: LocalCurrency = {
  code: "MYR",
  prefix: "RM",
  perUsd: 4.045,
  updatedAt: "2026-08-15T12:00:00.000Z",
};
