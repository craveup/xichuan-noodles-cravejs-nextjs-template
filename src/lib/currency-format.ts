// lib/currency-format.ts
export enum Currencies {
  USD = 'usd',
  GBP = 'gbp',
  AED = 'aed',
  AUD = 'aud',
}

// ISO 4217 codes for Intl
const ISO_BY_CURRENCY: Record<Currencies, string> = {
  [Currencies.USD]: "USD",
  [Currencies.AUD]: "AUD",
  [Currencies.GBP]: "GBP",
  [Currencies.AED]: "AED",
};

// Sensible default locales per currency (overrideable)
const LOCALE_BY_CURRENCY: Record<Currencies, string> = {
  [Currencies.USD]: "en-US",
  [Currencies.AUD]: "en-AU",
  [Currencies.GBP]: "en-GB",
  [Currencies.AED]: "en-AE",
};

type MoneyInput = number | string | null | undefined;

export function formatMoney(
  amount: MoneyInput,
  currency: Currencies,
  opts?: {
    /** Set true if amount is in minor units (cents/fils) */
    minorUnits?: boolean;
    /** Force locale (defaults to one mapped to the currency) */
    locale?: string;
    /** How many fraction digits to show (min=max). Defaults to 2. */
    fractionDigits?: number;
  }
): string {
  if (amount === null || amount === undefined || amount === "") return "";

  // Normalize to number
  let n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return "";

  if (opts?.minorUnits) n = n / 100;

  const locale = opts?.locale ?? LOCALE_BY_CURRENCY[currency] ?? "en";
  const code = ISO_BY_CURRENCY[currency];

  // Force trailing zeros by keeping min=max
  const fractionDigits = opts?.fractionDigits ?? 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

// React hook if you prefer to bind a currency once
import { useMemo } from "react";
export function useCurrencyFormatter(
  currency: Currencies,
  options?: Omit<Parameters<typeof formatMoney>[2], "locale"> & { locale?: string }
) {
  const { locale, ...rest } = options ?? {};
  return useMemo(() => {
    return (amount: MoneyInput) => formatMoney(amount, currency, { locale, ...rest });
  }, [currency, locale, JSON.stringify(rest)]);
}

export const formatPrice = (amount: string | number, currencyCode: Currencies) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(amount));
};
