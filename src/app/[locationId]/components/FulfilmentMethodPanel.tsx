"use client";

import ErrorMessage from "@/components/ErrorMessage";
import FulfilmentMethodHandler from "@/components/fulfillment-methods/FulfilmentMethodHandler";
import { useCart } from "@/hooks/useCart";

function FulfilmentMethodPanel() {
  const { cart, errorMessage, isLoading, shouldFetch } = useCart();

  if (!shouldFetch || isLoading) {
    return null;
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  if (!cart) {
    return null;
  }

  return <FulfilmentMethodHandler fulfilmentMethod={cart.fulfilmentMethod} />;
}

export default FulfilmentMethodPanel;
