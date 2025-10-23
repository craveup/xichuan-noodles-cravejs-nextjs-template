import { ApiError } from "@craveup/storefront-sdk";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY?.trim() || "";

export const getServerApiKey = () =>
  process.env.NEXT_PUBLIC_API_KEY?.trim() || "";

export { ApiError };
