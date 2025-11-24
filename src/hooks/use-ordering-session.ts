"use client";

import { useEffect, useMemo, useState } from "react";
import {
  startOrderingSession,
  type StartOrderingSessionRequest,
} from "@/lib/api/ordering-session";
import { getCartId, setCartId } from "@/lib/local-storage";
import { toErrorMessage } from "@/lib/api/error-utils";
import { FulfilmentMethods } from "@craveup/storefront-sdk";
import { DEFAULT_FULFILLMENT_METHOD } from "@/constants";

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
    normalizedLocationId
      ? getCartId(normalizedLocationId, fulfillmentMethod) || null
      : null,
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

    const storedId =
      getCartId(normalizedLocationId, fulfillmentMethod) || null;
    if (storedId) {
      if (storedId !== cartId) {
        setCartIdState(storedId);
      }
    } else if (cartId) {
      setCartIdState(null);
    }
  }, [cartId, normalizedLocationId, fulfillmentMethod]);

  useEffect(() => {
    if (!normalizedLocationId) {
      return;
    }

    let cancelled = false;

    const initializeSession = async () => {
      setIsLoading(true);
      setError("");
      setOrderingError("");

      const storedCartId =
        getCartId(normalizedLocationId, fulfillmentMethod) || undefined;
      const returnUrl =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const payload: OrderingSessionPayload = {
        existingCartId: storedCartId,
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

        if (cancelled) {
          return;
        }

        const resolvedCartId = newCartId ?? storedCartId ?? null;
        if (resolvedCartId) {
          setCartId(normalizedLocationId, resolvedCartId, fulfillmentMethod);
        }
        setCartIdState(resolvedCartId);
        setOrderingError(errorMessage ?? "");
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(toErrorMessage(err));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeSession();

    return () => {
      cancelled = true;
    };
  }, [fulfillmentMethod, normalizedLocationId]);

  return { cartId, isLoading, error, orderingError };
}
