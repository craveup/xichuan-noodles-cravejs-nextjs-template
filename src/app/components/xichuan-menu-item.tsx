"use client";

import Image from "next/image";
import { MouseEvent } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuItem } from "../types";
import type { Product } from "@/lib/api/types";
import { formatMoney, Currencies } from "@/lib/currency";

interface XichuanMenuItemProps {
  item: MenuItem;
  onCustomize: (productId: string) => void;
  onQuickAdd: (product: Product) => Promise<void>;
  isAdding?: boolean;
}

export function XichuanMenuItem({
  item,
  onCustomize,
  onQuickAdd,
  isAdding = false,
}: XichuanMenuItemProps) {
  const product = item.apiProduct;
  const hasModifiers =
    (product?.modifiers?.length ?? 0) > 0 ||
    (product?.modifierIds?.length ?? 0) > 0;

  const handleCardClick = () => {
    if (!product) return;
    onCustomize(product.id);
  };

  const handleAddClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!product) {
      return;
    }

    if (hasModifiers) {
      onCustomize(product.id);
      return;
    }

    await onQuickAdd(product);
  };

  const rawDisplayPrice =
    product?.displayPrice ??
    (typeof product?.price === "string" ? product.price : null);

  const numericPrice =
    typeof product?.price === "number"
      ? product.price
      : typeof product?.price === "string"
      ? Number.parseFloat(product.price)
      : item.price;

  const priceLabel = (() => {
    if (typeof rawDisplayPrice === "string") {
      const trimmed = rawDisplayPrice.trim();
      if (trimmed.length > 0) {
        if (!trimmed.includes(" ") && !trimmed.includes("-")) {
          const formatted = formatMoney(trimmed, Currencies.USD);
          if (formatted.trim().length > 0) {
            return formatted;
          }
        }
        return trimmed;
      }
    }

    const formattedNumeric = formatMoney(numericPrice, Currencies.USD);
    if (formattedNumeric.trim().length > 0) {
      return formattedNumeric;
    }

    return `$${
      Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : "0.00"
    }`;
  })();

  const description = item.description ?? "";
  const parentheticalNotes = Array.from(description.matchAll(/\(([^)]+)\)/g))
    .map((match) => match[1]?.trim())
    .filter(Boolean) as string[];
  const mainDescription = description.replace(/\s*\([^)]*\)/g, "").trim();

  return (
    <Card
      className="flex h-full flex-col gap-0 overflow-hidden transition-shadow hover:shadow-lg cursor-pointer py-0"
      onClick={product ? handleCardClick : undefined}
      role="article"
      aria-labelledby={`item-${item.id}-name`}
    >
      <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-[360px] overflow-hidden rounded-t-xl bg-muted">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <CardContent className="flex flex-1 flex-col p-6">
        <div className="space-y-3">
          <h3
            id={`item-${item.id}-name`}
            className="text-xl font-semibold text-foreground"
          >
            {item.name}
          </h3>
          {mainDescription && (
            <p className="text-sm text-muted-foreground line-clamp-3 min-h-10">
              {mainDescription}
            </p>
          )}
          {parentheticalNotes.length > 0 && (
            <div className="space-y-0">
              {parentheticalNotes.map((note, index) => (
                <p
                  key={`${item.id}-note-${index}`}
                  className="text-normal font-semibold text-red-500"
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--brand-accent))" }}
          >
            {priceLabel}
          </span>

          <Button
            onClick={handleAddClick}
            className="rounded-full h-11 w-11 p-0 text-white dark:text-white cursor-pointer"
            style={{ backgroundColor: "hsl(var(--brand-accent))" }}
            aria-label={hasModifiers ? "Customize item" : "Add to cart"}
            disabled={isAdding}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {hasModifiers && (
          <p className="mt-3 text-xs text-muted-foreground">
            Customizable · Tap to choose options
          </p>
        )}
      </CardContent>
    </Card>
  );
}
