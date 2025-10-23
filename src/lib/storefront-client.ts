import { createStorefrontClient } from "@craveup/storefront-sdk";

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
};

export const storefrontClient = createStorefrontClient({
  getAuthToken,
});
