"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { useCart } from "../providers/cart-provider";
import { ClientIcon } from "./client-icon";

interface XichuanCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function XichuanCart({ isOpen, onClose }: XichuanCartProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    total,
    checkoutUrl,
    itemCount,
    isLoading,
    busyItemId,
    error,
    clearError,
    usingApi,
  } = useCart();

  const handleSheetOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  const handleQuantityChange = useCallback(
    (cartItemId: string, nextQuantity: number) => {
      if (!cartItemId || busyItemId === cartItemId) return;
      void updateQuantity(cartItemId, nextQuantity);
    },
    [busyItemId, updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (cartItemId: string) => {
      if (!cartItemId || busyItemId === cartItemId) return;
      void removeItem(cartItemId);
    },
    [busyItemId, removeItem]
  );

  const handleCheckout = useCallback(() => {
    if (isLoading || busyItemId) {
      return;
    }

    const targetUrl = checkoutUrl?.trim();
    if (!targetUrl) {
      return;
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      window.location.href = targetUrl;
      return;
    }

    const normalized = targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`;
    window.location.href = normalized;
  }, [busyItemId, checkoutUrl, isLoading]);

  const showLoadingState = isLoading && usingApi && items.length === 0;
  const isCartEmpty = items.length === 0;
  const orderItemLabel = itemCount === 1 ? "item" : "items";

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Order ({itemCount} {orderItemLabel})</SheetTitle>
        </SheetHeader>

        {usingApi && (
          <div className="px-4 pt-2">
            <Badge variant="secondary" className="text-xs">
              Connected to CraveUp API
            </Badge>
          </div>
        )}

        {error && (
          <div className="px-4 pt-3">
            <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3">
              <ClientIcon
                name="AlertTriangle"
                className="h-5 w-5 text-destructive mt-0.5"
              />
              <div className="flex-1 text-sm text-destructive">
                <p className="font-medium">We hit a snag</p>
                <p className="text-xs opacity-90">{error}</p>
                <Button
                  variant="link"
                  className="px-0 text-xs text-destructive underline"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showLoadingState ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
              <ClientIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              Updating your cart...
            </div>
          ) : isCartEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <ClientIcon name="ChefHat" className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Add some delicious Xi&apos;an noodles to get started!
                </p>
              </div>
              <Button
                onClick={onClose}
                className="text-white dark:text-white"
                style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              >
                <ClientIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const cartItemId = item.cartId;
                const itemKey = cartItemId || `${item.name}-${index}`;

                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">
                        {item.name}
                      </h4>

                      <div className="text-xs text-muted-foreground mb-2 space-y-1">
                        {item.selectionsText && (
                          <div className="text-xs text-muted-foreground">
                            {item.selectionsText}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <div className="text-xs italic text-muted-foreground">
                            Notes: {item.specialInstructions}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          ${item.price.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                          handleQuantityChange(cartItemId, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                            disabled={isLoading || busyItemId === cartItemId}
                          >
                            <ClientIcon name="Minus" className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center font-medium">
                            {busyItemId === cartItemId ? (
                              <ClientIcon
                                name="Loader2"
                                className="h-4 w-4 animate-spin"
                              />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(cartItemId, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                            disabled={isLoading || busyItemId === cartItemId}
                          >
                            <ClientIcon name="Plus" className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(cartItemId)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            disabled={isLoading || busyItemId === cartItemId}
                          >
                            <ClientIcon name="Trash2" className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full text-white dark:text-white"
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              onClick={handleCheckout}
              disabled={
                isLoading || !!busyItemId || items.length === 0 || !checkoutUrl
              }
            >
              <ClientIcon name="CreditCard" className="h-4 w-4" />
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              disabled={isLoading}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
