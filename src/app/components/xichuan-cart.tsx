"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveSheet } from "@/components/ResponsiveSheet";
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
    total,
    checkoutUrl,
    isLoading,
    busyItemId,
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

  const showLoadingState = isLoading && items.length === 0;
  const isCartEmpty = items.length === 0;

  const sheetTitle = `Your Order`;
  const sheetDescription = "Review your items and proceed to checkout.";

  const footerContent = (
    <div className="space-y-3 bg-background">
      <div className="flex items-center justify-between text-base font-semibold text-foreground">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
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
  );

  return (
    <ResponsiveSheet
      open={isOpen}
      setOpen={handleSheetOpenChange}
      title={sheetTitle}
      titleClassName="text-lg font-semibold text-foreground"
      description={sheetDescription}
      headerClassName="px-4 py-4 border-b border-border bg-background text-foreground"
      className="flex h-full w-full flex-col overflow-hidden rounded-none border-l border-border/40 bg-background text-foreground sm:max-w-lg"
      innerContentClassName="flex flex-col bg-background pb-6"
      hideMainBtn
      hideCloseBtn
      footer={footerContent}
    >
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-hide">
          {showLoadingState ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
              <ClientIcon
                name="Loader2"
                className="mr-2 h-4 w-4 animate-spin"
              />
              Updating your cart...
            </div>
          ) : isCartEmpty ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 px-6 py-12 text-center shadow-sm dark:border-border/60 dark:bg-muted/20">
              <ClientIcon
                name="ChefHat"
                className="mb-3 h-16 w-16 text-muted-foreground"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add some delicious Xi&apos;an noodles to get started!
                </p>
              </div>
              <Button
                onClick={onClose}
                className="mt-4 text-white dark:text-white"
                style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              >
                <ClientIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const cartItemId = item.cartId;
                const itemKey = cartItemId || `${item.name}-${index}`;
                const specialInstructions = item.specialInstructions?.trim();
                const lineTotal = item.price * item.quantity;

                return (
                  <Card
                    key={itemKey}
                    className="rounded-2xl border border-border bg-card p-4 text-foreground dark:border-border/60 dark:bg-muted/20"
                  >
                    <div className="flex w-full gap-4 sm:gap-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/70 shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:bg-muted/40 dark:ring-border/50 dark:shadow-none">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-foreground">
                          <p className="truncate text-sm font-semibold sm:text-base">
                            {item.name}
                          </p>
                          <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Qty {item.quantity}
                          </span>
                        </div>

                        {item.selectionsText ? (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {item.selectionsText}
                          </p>
                        ) : null}

                        {specialInstructions ? (
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground/90 break-all">
                            Special instructions: {specialInstructions}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end justify-start gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          ${lineTotal.toFixed(2)}
                        </span>

                        <div className="flex max-w-[120px] items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              item.quantity === 1
                                ? handleRemoveItem(cartItemId)
                                : handleQuantityChange(
                                    cartItemId,
                                    item.quantity - 1
                                  )
                            }
                            className="h-9 w-9 rounded-xl"
                            disabled={isLoading || busyItemId === cartItemId}
                          >
                            <ClientIcon
                              name={item.quantity === 1 ? "Trash2" : "Minus"}
                              className="h-4 w-4"
                            />
                          </Button>

                          <div className="flex h-9 min-w-10 items-center justify-center rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground dark:bg-background/40">
                            {busyItemId === cartItemId ? (
                              <ClientIcon
                                name="Loader2"
                                className="h-4 w-4 animate-spin"
                              />
                            ) : (
                              <span>{item.quantity}</span>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(
                                cartItemId,
                                item.quantity + 1
                              )
                            }
                            className="h-9 w-9 rounded-xl"
                            disabled={isLoading || busyItemId === cartItemId}
                          >
                            <ClientIcon name="Plus" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ResponsiveSheet>
  );
}
