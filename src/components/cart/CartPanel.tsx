"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResponsiveSheet } from "@/components/ResponsiveSheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCart } from "@/hooks/useCart";
import { STRINGS } from "@/strings";
import CartItemsList from "./CartItemsList";

export type CartPanelProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export default function CartPanel({ isOpen, setOpen }: CartPanelProps) {
  const { cart } = useCart();
  const router = useRouter();

  const cartId = cart?.id ?? null;
  const locationId = cart?.locationId ?? null;

  if (!cart) return null;

  function onMainBtnClick() {
    const checkoutUrl = cart.checkoutUrl?.trim() || null;

    if (!cartId || !locationId) {
      toast.error("Cart is not ready yet. Please try again.");
      return;
    }

    if (!checkoutUrl) {
      toast.error("Checkout is temporarily unavailable. Please try again.");
      return;
    }

    setOpen(false);

    if (/^https?:\/\//i.test(checkoutUrl)) {
      window.location.href = checkoutUrl;
      return;
    }

    router.push(checkoutUrl);
  }

  const submitLabel = `${STRINGS.cartPanel.ctaCheckoutPrefix}`;
  const description = STRINGS.cartPanel.descriptionDefault;

  return (
    <ResponsiveSheet
      className='md:max-w-[500px]'
      innerContentClassName='px-4'
      open={isOpen}
      setOpen={setOpen}
      title={STRINGS.cartPanel.title}
      description={description}
      hideCloseBtn
      submitLabel={submitLabel}
      onMainBtnClick={onMainBtnClick}
    >
      {cart.status === "COMPLETED" && (
        <div className='mb-3'>
          <Alert>
            <AlertTitle>{STRINGS.cartPanel.completedBannerTitle}</AlertTitle>
            <AlertDescription>
              {STRINGS.cartPanel.completedBannerDesc}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <CartItemsList />
    </ResponsiveSheet>
  );
}
