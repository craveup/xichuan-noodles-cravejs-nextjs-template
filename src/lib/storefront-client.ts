import { createStorefrontClient } from "@craveup/storefront-sdk";

const apiKey = process.env.NEXT_PUBLIC_CRAVEUP_API_KEY;

if (!apiKey) {
  throw new Error(
    "NEXT_PUBLIC_CRAVEUP_API_KEY must be defined to initialize the storefront SDK.",
  );
}

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
};

export const storefrontClient = createStorefrontClient({
  apiKey,
  getAuthToken,
});
