"use client";

import React, {useState} from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useMediaQuery } from "@/hooks/use-media-query";
import CartPanel from "@/components/cart/CartPanel";

export default function CartNavButton() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { cart } = useCart();

  if (!isDesktop) return null; // Use bottom bar on mobile

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="View cart"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Open cart</span>
          {!!cart?.totalQuantity && <span
              className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {cart.totalQuantity}
        </span>}
      </Button>

      <CartPanel
        isOpen={open}
        setOpen={setOpen}
      />
    </>
  );
}

