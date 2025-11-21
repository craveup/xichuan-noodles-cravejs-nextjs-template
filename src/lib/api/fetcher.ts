import type { RequestConfig } from "@craveup/storefront-sdk";
import { storefrontClient } from "@/lib/storefront-client";

export { ApiError } from "@craveup/storefront-sdk";

export function apiFetch<T>(endpoint: string, options?: RequestConfig) {
  return storefrontClient.http.get<T>(endpoint, options);
}

export const swrFetcher = <T = unknown>(endpoint: string) =>
  apiFetch<T>(endpoint);
