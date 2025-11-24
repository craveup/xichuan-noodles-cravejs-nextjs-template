import { ApiError } from "@craveup/storefront-sdk";
import { CRAVEUP_PUBLIC_API_KEY } from "@/constants";

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

export const IS_API_CONFIGURED = Boolean(getApiKey());

export { ApiError };
