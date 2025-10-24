import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { StorefrontCart } from "@/lib/api/types";
import { fetchCart } from "@/lib/api/client";
import {
  getStoredCartId,
  setStoredCartId,
} from "@/lib/cart-storage";
import { toErrorMessage } from "@/lib/api/error-utils";

type UseCartOptions = {
  locationId?: string;
  cartId?: string | null;
  shouldFetch?: boolean;
};

type MutateInput =
  | StorefrontCart
  | null
  | undefined
  | ((
      current: StorefrontCart | undefined
    ) => StorefrontCart | null | undefined)
  | Promise<StorefrontCart | null | undefined>;

export function useCart(options: UseCartOptions = {}) {
  const queryClient = useQueryClient();

  const locationId = options.locationId?.trim() ?? "";

  const [isHydrated, setIsHydrated] = useState(false);
  const [resolvedCartId, setResolvedCartId] = useState<string | null>(
    options.cartId ?? null
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!locationId) return;

    if (typeof options.cartId !== "undefined") {
      setResolvedCartId(
        options.cartId === null ? null : String(options.cartId)
      );
      return;
    }

    const stored = getStoredCartId(locationId);
    if (stored) {
      setResolvedCartId(stored);
    }
  }, [isHydrated, locationId, options.cartId]);

  const activeCartId = useMemo(() => {
    if (typeof options.cartId !== "undefined" && options.cartId !== null) {
      return String(options.cartId);
    }
    return resolvedCartId;
  }, [options.cartId, resolvedCartId]);

  const shouldFetchBase = options.shouldFetch ?? true;
  const shouldFetch = Boolean(
    shouldFetchBase && locationId && activeCartId && isHydrated
  );

  const queryKey = useMemo(
    () => [
      "cart",
      locationId || "__no-location__",
      activeCartId ?? "__no-cart__",
    ],
    [activeCartId, locationId]
  );

  const cartQuery = useQuery<StorefrontCart>({
    queryKey,
    queryFn: async () => {
      if (!locationId || !activeCartId) {
        throw new Error("Cart identifiers are not ready.");
      }
      const cart = await fetchCart(locationId, activeCartId);
      return cart;
    },
    enabled: shouldFetch,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isHydrated || !locationId) return;
    const latestId = cartQuery.data?.id ?? activeCartId ?? null;
    setStoredCartId(locationId, latestId);
    if (latestId && latestId !== resolvedCartId) {
      setResolvedCartId(latestId);
    }
  }, [
    activeCartId,
    cartQuery.data?.id,
    isHydrated,
    locationId,
    resolvedCartId,
  ]);

  const mutate = useCallback(
    async (updater?: MutateInput) => {
      if (!locationId) return;

      if (typeof updater === "undefined") {
        await queryClient.invalidateQueries({ queryKey });
        return;
      }

      const nextValue = await Promise.resolve(
        typeof updater === "function"
          ? (updater as (
              current: StorefrontCart | undefined
            ) => StorefrontCart | null | undefined)(cartQuery.data)
          : updater
      );

      if (nextValue) {
        queryClient.setQueryData(queryKey, nextValue);
        if (nextValue.id && nextValue.id !== resolvedCartId) {
          setResolvedCartId(nextValue.id);
        }
      } else {
        queryClient.removeQueries({ queryKey });
        setResolvedCartId(null);
      }
    },
    [cartQuery.data, queryClient, queryKey, locationId, resolvedCartId]
  );

  const errorMessage = cartQuery.error
    ? toErrorMessage(cartQuery.error)
    : undefined;

  const isLoading = shouldFetch ? cartQuery.isLoading : false;

  return {
    cart: cartQuery.data,
    cartId: cartQuery.data?.id ?? activeCartId ?? null,
    locationId,
    error: cartQuery.error ?? null,
    errorMessage,
    isLoading,
    isValidating: cartQuery.isFetching,
    mutate,
    shouldFetch,
    setCartIdState: setResolvedCartId,
  };
}
