import { ApiError } from "@craveup/storefront-sdk";

const resolveBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.trim() ??
  process.env.NEXT_PUBLIC_CRAVEUP_STOREFRONT_BASE_URL?.trim() ??
  "http://localhost:8000";

const resolvePublicApiKey = () =>
  process.env.NEXT_PUBLIC_CRAVEUP_API_KEY?.trim() ?? "";

const resolveServerApiKey = () =>
  process.env.NEXT_PUBLIC_CRAVEUP_API_KEY?.trim() ?? "";

export const API_BASE_URL = resolveBaseUrl();
export const API_KEY = resolvePublicApiKey();
export const getServerApiKey = resolveServerApiKey;

export { ApiError };
