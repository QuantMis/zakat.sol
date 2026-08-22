import { LOCAL_CURRENCY } from "@/data/currency";
import type { CalendarSystem } from "@/lib/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Sub-dollar token prices need significant digits, not fixed decimals. */
const smallUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 3,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Headline money, where the magnitude is the point and the cents are noise. */
const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Takes a decimal rate — 0.0834 reads as 8.34%. */
export function formatPercent(value: number): string {
  return percent.format(value);
}

export function formatUsd(value: number): string {
  return usd.format(value);
}

/** "$3.2M". Under a thousand it falls back to the plain figure — "$840". */
export function formatCompactUsd(value: number): string {
  return compactUsd.format(value);
}

export function formatCount(value: number): string {
  return count.format(value);
}

export function formatPrice(value: number): string {
  return value < 1 ? smallUsd.format(value) : usd.format(value);
}

/**
 * A USD figure written in the local currency — "RM 129.31". Deliberately not
 * `Intl`'s currency style: that renders "MYR 129.31" for a non-Malaysian
 * locale, and the prefix people actually use is the point of showing it.
 */
export function formatLocal(usdValue: number): string {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue * LOCAL_CURRENCY.perUsd);

  return `${LOCAL_CURRENCY.prefix} ${amount}`;
}

export function formatSigned(value: number): string {
  return `${value < 0 ? "−" : ""}${usd.format(Math.abs(value))}`;
}

export function formatBalance(value: number, decimals: number): string {
  if (value >= 1_000_000) return compact.format(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatSol(value: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(value)} SOL`;
}

/**
 * Dates are formatted in UTC so the server and client always agree — the
 * scan timestamp is part of the report, not the reader's local clock.
 */
const gregorianDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const clockTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatGregorian(iso: string): string {
  return gregorianDate.format(new Date(iso));
}

/** Intl renders "Rabiʻ I 2, 1448 AH"; the design reads "2 Rabiʻ I 1448 AH". */
export function formatHijri(iso: string): string {
  const parts = hijriDate.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("day")} ${get("month")} ${get("year")} AH`;
}

export function formatDate(iso: string, calendar: CalendarSystem): string {
  return calendar === "hijri" ? formatHijri(iso) : formatGregorian(iso);
}

export function formatTime(iso: string): string {
  return clockTime.format(new Date(iso));
}

export function hijriYear(iso: string): string {
  const year = hijriDate
    .formatToParts(new Date(iso))
    .find((part) => part.type === "year")?.value;

  return `${year} AH`;
}

export function gregorianYear(iso: string): string {
  return String(new Date(iso).getUTCFullYear());
}

export function formatYear(iso: string, calendar: CalendarSystem): string {
  return calendar === "hijri" ? hijriYear(iso) : gregorianYear(iso);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 5)}…${address.slice(-5)}`;
}
