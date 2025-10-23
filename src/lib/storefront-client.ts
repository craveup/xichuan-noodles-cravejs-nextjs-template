import { createStorefrontClient } from "@craveup/storefront-sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

const apiKey = process.env.NEXT_PUBLIC_API_KEY?.trim();

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
