// src/hooks/use-ordering-session.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { startOrderingSession } from "@/lib/api/ordering-session";
import { getCartId, setCartId } from "@/lib/local-storage";
import { formatApiError } from "@/lib/format-api-error";
import { FulfilmentMethods } from "@/contracts";
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";

export type OrderingSessionStatus = "loading" | "error" | "ready";

export type UseOrderingSessionResult = {
  cartId: string | null;
  status: OrderingSessionStatus;
  error?: string;
};

type UseOrderingSessionOptions = {
  locationId: string;
  preferredFulfillment?: string | null;
};

type StartOrderingSessionPayload = {
  existingCartId: string | null;
  marketplaceId?: string;
  fulfillmentMethod: FulfilmentMethods;
};

export function useOrderingSession({
  locationId,
  preferredFulfillment,
}: UseOrderingSessionOptions): UseOrderingSessionResult {
  const {
    cartId: sessionCartId,
    setOrderInfo,
    setOrderSessionError,
  } = useOrderInfoStore();

  const [status, setStatus] = useState<OrderingSessionStatus>(
    () => (sessionCartId ? "ready" : "loading"),
  );
  const [error, setError] = useState<string | undefined>();

  const fulfillmentMethod = useMemo(() => {
    if (!preferredFulfillment) return FulfilmentMethods.TAKEOUT;
    const normalized = preferredFulfillment.trim().toLowerCase().replace(/-/g, '_');
    const match = (Object.values(FulfilmentMethods) as string[]).find(
      (value) => value === normalized,
    );
    return (match as FulfilmentMethods | undefined) ?? FulfilmentMethods.TAKEOUT;
  }, [preferredFulfillment]);

  useEffect(() => {
    if (sessionCartId) {
      setStatus("ready");
      setError(undefined);
      return;
    }

    let cancelled = false;

    async function bootstrapSession() {
      setStatus("loading");
      setError(undefined);

      const payload: StartOrderingSessionPayload = {
        existingCartId: getCartId(locationId, fulfillmentMethod),
        fulfillmentMethod,
      };

      try {
        const response = await startOrderingSession(locationId, payload);
        if (cancelled) return;

        const nextCartId = response.cartId;
        if (nextCartId) {
          setCartId(locationId, nextCartId, fulfillmentMethod);
          setOrderInfo({ cartId: nextCartId, locationId });
        } else { 
          setOrderInfo({ locationId });
        }

        setOrderSessionError(response.errorMessage ?? "");
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        const { message } = formatApiError(err);
        setError(message);
        setStatus("error");
      }
    }

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [
    locationId,
    fulfillmentMethod,
    sessionCartId,
    setOrderInfo,
    setOrderSessionError,
  ]);

  return {
    cartId: sessionCartId || null,
    status,
    error,
  };
}
