"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import CounterButton from "@/components/CounterButton";
import { updateCartItemQuantity } from "@/lib/api";
import { formatMoney } from "@/lib/currency-format";
import { formatApiError } from "@/lib/format-api-error";
import { useCart } from "@/hooks/useCart";
import type { CartItem, CartModifierGroup } from "@/types/cart-types";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export type CartItemRowProps = {
  hideQuantityButton?: boolean;
  cartItem: CartItem;
};

type CartModifierItemWithFormatted = CartModifierGroup["items"][number] & {
  priceFormatted?: string;
};

export default function CartItemRow({ cartItem, hideQuantityButton }: CartItemRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { cart, mutate } = useCart();
  const TOAST_DURATION_MS = 600;


  const normalizeCurrency = useMemo(() => {
    return (raw: string, formatted?: string) => {
      if (formatted && formatted.trim()) return formatted;
      return formatMoney(raw, cart.currency);
    };
  }, [cart.currency]);

  const discountValue = Number(cartItem.discount ?? 0);
  const totalBeforeDiscountRaw = (Number(cartItem.total ?? 0) + discountValue).toFixed(2);
  const totalPrice = normalizeCurrency(totalBeforeDiscountRaw, undefined);

  const trimmedInstructions = cartItem.specialInstructions?.trim();
  const hasSelections = cartItem.selections?.length > 0;

  async function handleUpdateQuantity(nextQty: number) {
    if (!cart) return;

    try {
      setIsLoading(true);
      const updatedCart = await updateCartItemQuantity(
        cart.locationId,
        cart.id,
        cartItem.id,
        nextQty,
      );

      const prevQty = cartItem.quantity;
      let message = "Cart updated";
      if (nextQty <= 0) {
        message = "Item removed from cart";
      } else if (nextQty > prevQty) {
        message = "Item quantity increased";
      } else if (nextQty < prevQty) {
        message = "Item quantity decreased";
      }
      toast.success(message, { duration: TOAST_DURATION_MS });

      if (updatedCart) {
        await mutate(updatedCart, false);
      } else {
        await mutate();
      }
    } catch (error) {
      const formattedError = formatApiError(error);
      toast.error(formattedError.message, { duration: TOAST_DURATION_MS });
    } finally {
      setIsLoading(false);
    }
  }

  const selectionSummary = useMemo(() => {
    if (!hasSelections) return "";

    const parts: string[] = [];

    const visitGroups = (groups: CartModifierGroup[]) => {
      groups.forEach((group) => {
        const label = group.items
          .map((groupItem) => {
            const item = groupItem as CartModifierItemWithFormatted;
            const prefix = item.quantity > 1 ? `${item.quantity}× ` : "";
            return `${prefix}${item.name}`;
          })
          .join(", ");
        if (label) {
          parts.push(`${group.name}: ${label}`);
        }

        group.items.forEach((groupItem) => {
          const item = groupItem as CartModifierItemWithFormatted;
          if (item.children?.length) {
            visitGroups(item.children);
          }
        });
      });
    };

    visitGroups(cartItem.selections);
    return parts.join(" · ");
  }, [cartItem.selections, hasSelections]);

  return (
    <Card className="p-4">
      <div className="flex gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          <ImageWithFallback
            src={cartItem.imageUrl}
            alt={cartItem.name}
            fill
            className="object-cover"
            sizes="80px"
            fallbackClassName="flex h-full w-full items-center justify-center text-muted-foreground"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-foreground">
                <p className="text-sm font-semibold sm:text-base">{cartItem.name}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Qty {cartItem.quantity}
                </span>
              </div>

              {trimmedInstructions && (
                <p className="text-xs text-muted-foreground">Special instructions: {trimmedInstructions}</p>
              )}
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm font-semibold text-foreground">{totalPrice}</p>
            </div>
          </div>

          {hasSelections && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{selectionSummary}</p>
          )}

          {!hideQuantityButton && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CounterButton
                quantity={cartItem.quantity}
                isLoading={isLoading}
                onIncrease={() => handleUpdateQuantity(cartItem.quantity + 1)}
                onDecrease={() => handleUpdateQuantity(cartItem.quantity - 1)}
                className="sm:ml-auto"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
