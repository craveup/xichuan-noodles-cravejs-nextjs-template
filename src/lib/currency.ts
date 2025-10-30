export enum Currencies {
  USD = "usd",
  GBP = "gbp",
  AED = "aed",
  AUD = "aud",
}

const ISO_BY_CURRENCY: Record<Currencies, string> = {
  [Currencies.USD]: "USD",
  [Currencies.GBP]: "GBP",
  [Currencies.AED]: "AED",
  [Currencies.AUD]: "AUD",
};

const LOCALE_BY_CURRENCY: Record<Currencies, string> = {
  [Currencies.USD]: "en-US",
  [Currencies.GBP]: "en-GB",
  [Currencies.AED]: "en-AE",
  [Currencies.AUD]: "en-AU",
};

type MoneyValue = number | string | null | undefined;

type CurrencyOptions = {
  minorUnits?: boolean;
  locale?: string;
  fractionDigits?: number;
};

export function formatMoney(
  amount: MoneyValue,
  currency: Currencies,
  options?: CurrencyOptions
): string {
  if (amount === null || amount === undefined || amount === "") {
    return "";
  }

  let numeric: number;
  let originalString: string | null = null;

  if (typeof amount === "string") {
    originalString = amount.trim();
    const sanitized = originalString.replace(/[^0-9.+-]/g, "");
    numeric = Number.parseFloat(sanitized);
  } else {
    numeric = Number(amount);
  }

  if (!Number.isFinite(numeric)) {
    return originalString ?? "";
  }

  if (options?.minorUnits) {
    numeric /= 100;
  }

  const locale = options?.locale ?? LOCALE_BY_CURRENCY[currency] ?? "en";
  const code = ISO_BY_CURRENCY[currency];
  const fractionDigits = options?.fractionDigits ?? 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
}

export function formatPrice(amount: MoneyValue, currency: Currencies) {
  return formatMoney(amount, currency);
}
