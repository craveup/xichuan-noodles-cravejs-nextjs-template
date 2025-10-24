"use client";

import { useEffect, useMemo, useState } from "react";
import {
  startOrderingSession,
  type StartOrderingSessionRequest,
} from "@/lib/api/ordering-session";
import { getStoredCartId, setStoredCartId } from "@/lib/cart-storage";
import { toErrorMessage } from "@/lib/api/error-utils";
import { FulfilmentMethods } from "@craveup/storefront-sdk";

type UseOrderingSessionResult = {
  cartId: string | null;
  isLoading: boolean;
  error: string;
  orderingError: string;
};

type UseOrderingSessionOptions = {
  fulfillmentMethod?: FulfilmentMethods | string;
};

type OrderingSessionPayload = StartOrderingSessionRequest & {
  returnUrl?: string;
};

const DEFAULT_FULFILLMENT_METHOD = FulfilmentMethods.TAKEOUT;

export function useOrderingSession(
  locationId?: string | null,
  options: UseOrderingSessionOptions = {},
): UseOrderingSessionResult {
  const normalizedLocationId = useMemo(
    () => locationId?.trim() ?? "",
    [locationId],
  );

  const fulfillmentMethod = useMemo(
    () => String(options.fulfillmentMethod ?? DEFAULT_FULFILLMENT_METHOD),
    [options.fulfillmentMethod],
  );

  const [cartId, setCartIdState] = useState<string | null>(() =>
    normalizedLocationId ? getStoredCartId(normalizedLocationId) : null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderingError, setOrderingError] = useState("");

  useEffect(() => {
    if (!normalizedLocationId) {
      if (cartId !== null) {
        setCartIdState(null);
      }
      setError("");
      setOrderingError("");
      return;
    }

    const storedId = getStoredCartId(normalizedLocationId);
    if (storedId) {
      if (storedId !== cartId) {
        setCartIdState(storedId);
      }
    } else if (cartId) {
      setCartIdState(null);
    }
  }, [cartId, normalizedLocationId]);

  useEffect(() => {
    if (!normalizedLocationId) {
      return;
    }

    let cancelled = false;

    async function init() {
      if (cartId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      setOrderingError("");

      const existingCartId =
        getStoredCartId(normalizedLocationId) || undefined;
      const returnUrl =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const payload: OrderingSessionPayload = {
        existingCartId,
        fulfillmentMethod,
      };

      if (returnUrl) {
        payload.returnUrl = returnUrl;
      }

      try {
        const { cartId: newCartId, errorMessage } = await startOrderingSession(
          normalizedLocationId,
          payload,
        );

        if (cancelled) return;

        const nextCartId = newCartId ?? existingCartId ?? null;
        if (nextCartId) {
          setStoredCartId(normalizedLocationId, nextCartId);
          setCartIdState(nextCartId);
        }

        setOrderingError(errorMessage ?? "");
      } catch (err) {
        if (cancelled) return;
        setError(toErrorMessage(err));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [cartId, fulfillmentMethod, normalizedLocationId]);

  return { cartId, isLoading, error, orderingError };
}
