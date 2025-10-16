import { ApiError } from "@craveup/storefront-sdk";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_CRAVEUP_API_URL ??
  process.env.CRAVEUP_API_BASE_URL ??
  "http://localhost:8000";

export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ??
  process.env.NEXT_PUBLIC_CRAVEUP_API_KEY ??
  process.env.CRAVEUP_API_KEY ??
  "";

export const getServerApiKey = () => process.env.CRAVEUP_API_KEY ?? "";

export { ApiError };
