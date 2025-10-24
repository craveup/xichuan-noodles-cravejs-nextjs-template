const CART_PREFIX = 'cu-cart:';
const DEFAULT_METHOD_KEY = 'default';

const normalizeLocation = (locationId: string) => locationId.trim();
const normalizeMethod = (method?: string) => (method ? method.trim().toLowerCase() : DEFAULT_METHOD_KEY);

const buildCartKey = (locationId: string, fulfillmentMethod?: string) =>
  `${CART_PREFIX}${normalizeLocation(locationId)}:${normalizeMethod(fulfillmentMethod)}`;

export function getCartId(locationId: string, fulfillmentMethod?: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(buildCartKey(locationId, fulfillmentMethod)) ?? "";
}

export function setCartId(locationId: string, cartId: string, fulfillmentMethod?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(buildCartKey(locationId, fulfillmentMethod), cartId);
}

export function clearCartIdsForLocation(locationId: string) {
  if (typeof window === "undefined") return;
  const prefix = `${CART_PREFIX}${normalizeLocation(locationId)}:`;
  for (let idx = window.localStorage.length - 1; idx >= 0; idx -= 1) {
    const key = window.localStorage.key(idx);
    if (key && key.startsWith(prefix)) {
      window.localStorage.removeItem(key);
    }
  }
}

// AUTH STORAGE
const keyName = "authToken";

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(keyName);
  }

  return "";
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    return localStorage.setItem(keyName, token);
  }
}

export function deleteAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(keyName);
  }
}
