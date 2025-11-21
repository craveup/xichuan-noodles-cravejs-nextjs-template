import { ApiError } from "@craveup/storefront-sdk";
import {
  STORE_FRONT_API_BASE_URL,
  CRAVEUP_PUBLIC_API_KEY,
} from "@/constants";

export const CRAVEUP_API_BASE = STORE_FRONT_API_BASE_URL;

export const API_SETUP_MESSAGE =
  "Add NEXT_PUBLIC_CRAVEUP_API_KEY and NEXT_PUBLIC_LOCATION_ID to .env.local to enable live ordering.";

export const getApiKey = () => {
  const apiKey = CRAVEUP_PUBLIC_API_KEY;
  if (!apiKey) {
    if (typeof window === "undefined") {
      console.warn(
        "NEXT_PUBLIC_CRAVEUP_API_KEY not found. API features will not work.",
      );
    }
    return "";
  }

  return apiKey;
};

export const API_KEY = "";
export const getServerApiKey = getApiKey;
export const IS_API_CONFIGURED = Boolean(getApiKey());

export const apiHeaders = () => ({
  "X-API-Key": getApiKey(),
  "Content-Type": "application/json",
});

export { ApiError };
