"use client";

import { Button } from "@/components/ui/button";
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
  const { items, removeItem, updateQuantity, subtotal, tax, total, itemCount } =
    useCart();

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Your Order</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ClientIcon
              name="ChefHat"
              className="h-16 w-16 text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some delicious Xi&apos;an noodles to get started!
            </p>
            <Button
              onClick={onClose}
              className="text-white dark:text-white"
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
            >
              <ClientIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Order ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.cartId}
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

                  {/* Options display */}
                  <div className="text-xs text-muted-foreground mb-2 space-y-1">
                    {item.options.spiceLevel > 0 && (
                      <div>
                        Spice Level:{" "}
                        {
                          [
                            "Mild",
                            "Medium",
                            "Spicy",
                            "Very Spicy",
                            "Fire Dragon",
                          ][item.options.spiceLevel]
                        }
                      </div>
                    )}
                    {item.options.noodleType && (
                      <div>
                        Noodles: {item.options.noodleType.replace("-", " ")}
                      </div>
                    )}
                    {item.options.extraToppings &&
                      item.options.extraToppings.length > 0 && (
                        <div>
                          Extras: {item.options.extraToppings.join(", ")}
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
                          updateQuantity(item.cartId, item.quantity - 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <ClientIcon name="Minus" className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity + 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <ClientIcon name="Plus" className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.cartId)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <ClientIcon name="Trash2" className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              onClick={() => {
                // Navigate to checkout
                window.location.href = "/checkout";
              }}
            >
              <ClientIcon name="CreditCard" className="h-4 w-4" />
              Proceed to Checkout
            </Button>

            <Button variant="outline" className="w-full" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
