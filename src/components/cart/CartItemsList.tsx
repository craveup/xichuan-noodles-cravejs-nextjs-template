"use client";

import React from "react";
import CartItemRow from "@/components/CartItemRow";
import {useCart} from "@/hooks/useCart";

export default function CartItemsList() {
    const {cart} = useCart();

    if (!cart || cart.items.length === 0) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm">No items</span>
                    </div>
                    <p>Your cart is empty</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-4">
            {cart.items.map((cartItem) => (
                <CartItemRow
                    key={cartItem.id}
                    cartItem={cartItem}
                />
            ))}
        </div>
    );
}

