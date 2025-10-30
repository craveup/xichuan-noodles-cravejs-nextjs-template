"use client";

import { MouseEvent } from "react";
import { Plus, Loader2, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuItem } from "../types";
import type { Product } from "@/lib/api/types";

interface XichuanMenuItemProps {
  item: MenuItem;
  onCustomize: (productId: string) => void;
  onQuickAdd: (product: Product) => Promise<void>;
  isAdding?: boolean;
}

const SPICE_LABELS = ["Mild", "Medium", "Spicy", "Very Spicy", "Fire Dragon"];
const SPICE_COLORS = [
  "text-green-600",
  "text-yellow-600",
  "text-orange-500",
  "text-red-500",
  "text-red-700",
];

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

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={product ? handleCardClick : undefined}
      role="article"
      aria-labelledby={`item-${item.id}-name`}
    >
      <div className="relative aspect-square">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {item.isSignature && (
          <Badge
            className="absolute top-4 left-4 text-white dark:text-white"
            style={{ backgroundColor: "hsl(var(--brand-accent))" }}
          >
            Signature
          </Badge>
        )}
        {item.isPopular && (
          <Badge
            className="absolute top-4 right-4 text-white dark:text-white"
            style={{ backgroundColor: "hsl(var(--brand-accent))" }}
          >
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3
            id={`item-${item.id}-name`}
            className="text-xl font-semibold text-foreground mb-1"
          >
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </div>

        {item.spiceLevel > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-4 w-4 text-red-500" />
            <span className={SPICE_COLORS[item.spiceLevel] ?? ""}>
              {SPICE_LABELS[item.spiceLevel] ?? "Spicy"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--brand-accent))" }}
          >
            ${item.price.toFixed(2)}
          </span>

          <Button
            onClick={handleAddClick}
            className="rounded-full h-11 w-11 p-0 text-white dark:text-white"
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
          <p className="text-xs text-muted-foreground">
            Customizable · Tap to choose options
          </p>
        )}
      </CardContent>
    </Card>
  );
}
