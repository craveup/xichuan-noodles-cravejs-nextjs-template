// src/hooks/useCart.ts
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";
import { StorefrontCart } from "@/types/cart-types";
import { useApiResource } from "./useApiResource";

export function useCart() {
  const { cartId, locationId } = useOrderInfoStore();
  const shouldFetch = Boolean(locationId && cartId);

  const { data, error, errorMessage, isLoading, isValidating, mutate } = useApiResource<StorefrontCart>(
    shouldFetch ? `/api/v1/locations/${locationId}/carts/${cartId}` : null,
  );

  return {
    cart: data!,
    error,
    errorMessage,
    isLoading,
    isValidating,
    mutate,
    shouldFetch,
  };
}
