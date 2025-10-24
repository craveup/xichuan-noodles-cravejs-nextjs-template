const CART_STORAGE_PREFIX = "cu-cart";

export const storageKeyForLocation = (locationId: string) =>
  `${CART_STORAGE_PREFIX}:${locationId}`;

export const getStoredCartId = (locationId: string): string | null => {
  if (typeof window === "undefined") return null;
  const storageKey = storageKeyForLocation(locationId);
  return window.localStorage.getItem(storageKey);
};

export const setStoredCartId = (
  locationId: string,
  cartId: string | null
): void => {
  if (typeof window === "undefined") return;
  const storageKey = storageKeyForLocation(locationId);
  if (cartId) {
    window.localStorage.setItem(storageKey, cartId);
  } else {
    window.localStorage.removeItem(storageKey);
  }
};

