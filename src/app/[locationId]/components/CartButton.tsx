// CartButton.tsx
"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import CartPanel from "@/components/cart/CartPanel";
import { useMediaQuery } from "@/hooks/use-media-query";

const CartButton = () => {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const totalQuantity = cart?.totalQuantity
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if(!cart) return null

  return (
    <>
      {!isDesktop && (totalQuantity ?? 0) > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="mx-auto max-w-sm px-4 py-3">
            <Button onClick={() => setOpen(true)} className="h-12 w-full justify-between rounded-full px-4">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">View cart</span>
              </span>
              <span className="opacity-90">({totalQuantity})</span>
            </Button>
          </div>
        </div>
      )}

      <CartPanel
        isOpen={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default CartButton;
