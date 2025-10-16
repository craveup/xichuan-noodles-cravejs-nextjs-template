import { createStorefrontClient } from "@craveup/storefront-sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_CRAVEUP_API_URL ??
  process.env.CRAVEUP_API_BASE_URL ??
  "http://localhost:8000";

const apiKey =
  process.env.NEXT_PUBLIC_API_KEY ??
  process.env.NEXT_PUBLIC_CRAVEUP_API_KEY ??
  process.env.CRAVEUP_API_KEY;

const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
};

export const storefrontClient = createStorefrontClient({
  baseUrl: normalizedBaseUrl,
  apiKey: apiKey || undefined,
  getAuthToken,
});
