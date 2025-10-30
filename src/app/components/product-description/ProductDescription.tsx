"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  ProductDescription as ProductDescriptionType,
  Modifier,
  SelectedModifierTypes,
} from "@/lib/api/types";
import { ItemUnavailableActions } from "@craveup/storefront-sdk";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import ModifierGroup from "./ModifierGroup";
import ItemCounterButton from "./ItemCounterButton";
import ItemUnavailableAction from "./ItemUnavailableAction";
import SpecialInstructions from "./SpecialInstructions";
import { useCart } from "../../providers/cart-provider";
import { cn } from "@/lib/utils";
import { formatMoney, Currencies } from "@/lib/currency";

interface ProductDescriptionProps {
  product: ProductDescriptionType;
  onClose: () => void;
}

const imagePlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAE7AQMAAAA7IG32AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFysrKceY6JgAAAC5JREFUeJztwQENAAAAwqD3T20PBxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwI8BXYQAAeEOeqIAAAAASUVORK5CYII=";

const buildModifierLookup = (modifiers: Modifier[] = []) => {
  const lookup = new Map<string, Modifier>();

  const visit = (group: Modifier | null | undefined) => {
    if (!group) return;
    if (!lookup.has(group.id)) {
      lookup.set(group.id, group);
      group.items.forEach((item) => {
        item.childGroups?.forEach((link) => {
          visit(link.group ?? null);
        });
      });
    }
  };

  modifiers.forEach((group) => visit(group));
  return lookup;
};

const formatRuleError = (group: Modifier) => {
  const { min, max } = group.rule;
  if (min === max) {
    return `Please select ${min} option${min === 1 ? "" : "s"} for ${
      group.name
    }.`;
  }
  if (min === 0) {
    return `Please select up to ${max} option${max === 1 ? "" : "s"} for ${
      group.name
    }.`;
  }
  return `Please select between ${min} and ${max} options for ${group.name}.`;
};

const ProductDescription = ({ product, onClose }: ProductDescriptionProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<SelectedModifierTypes[]>([]);
  const [itemUnavailableAction, setItemUnavailableAction] = useState(
    ItemUnavailableActions.REMOVE_ITEM
  );
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorGroupId, setErrorGroupId] = useState<string | null>(null);

  const modifierLookup = useMemo(
    () => buildModifierLookup(product.modifiers ?? []),
    [product.modifiers]
  );

  const productImage = product.images?.[0] ?? imagePlaceholder;
  const priceLabel = (() => {
    const raw = product.displayPrice ?? product.price ?? "";
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed.length === 0) {
        return "";
      }
      if (!trimmed.includes(" ") && !trimmed.includes("-")) {
        const formatted = formatMoney(trimmed, Currencies.USD);
        if (formatted.trim().length > 0) {
          return formatted;
        }
      }
      return trimmed;
    }

    const formattedNumeric = formatMoney(raw, Currencies.USD);
    if (formattedNumeric.trim().length > 0) {
      return formattedNumeric;
    }

    return "";
  })();

  const validateGroup = (groupId: string): boolean => {
    const group = modifierLookup.get(groupId);
    if (!group) return true;

    const selection = selections.find((entry) => entry.groupId === groupId);
    const totalSelected = selection
      ? selection.selectedOptions.reduce(
          (acc, option) => acc + option.quantity,
          0
        )
      : 0;

    if (totalSelected < group.rule.min || totalSelected > group.rule.max) {
      setErrorGroupId(groupId);
      setErrorMessage(formatRuleError(group));
      return false;
    }

    if (selection) {
      for (const option of selection.selectedOptions) {
        if (Array.isArray(option.children)) {
          for (const child of option.children) {
            if (!validateGroup(child.groupId)) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const validateSelections = () => {
    if (!Array.isArray(product.modifiers) || product.modifiers.length === 0) {
      return true;
    }

    for (const group of product.modifiers) {
      if (!validateGroup(group.id)) {
        return false;
      }
    }

    return true;
  };

  const handleAddToCart = async () => {
    setErrorMessage(null);
    setErrorGroupId(null);

    if (!validateSelections()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addToCart({
        product,
        quantity,
        selections,
        specialInstructions,
        itemUnavailableAction,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        id="product-description-section"
      >
        <div className="relative aspect-4/3 w-full">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imagePlaceholder}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {product.name}
            </h2>
            {priceLabel && (
              <p className="text-sm text-muted-foreground">{priceLabel}</p>
            )}
            {product.description && (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>

          <ModifierGroup
            modifiers={product.modifiers ?? []}
            selections={selections}
            setSelections={setSelections}
            disabled={isSubmitting}
            errorModifierGroupId={errorGroupId ?? undefined}
            onGroupInteract={(groupId) => {
              if (groupId === errorGroupId) {
                setErrorGroupId(null);
                setErrorMessage(null);
              }
            }}
          />

          <ItemUnavailableAction
            itemUnavailableAction={itemUnavailableAction}
            setItemUnavailableAction={setItemUnavailableAction}
            disabled={isSubmitting}
          />

          <SpecialInstructions
            specialInstructions={specialInstructions}
            setSpecialInstructions={setSpecialInstructions}
            disabled={isSubmitting}
          />

          {errorMessage && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-muted px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <ItemCounterButton
            value={quantity}
            onIncrease={() => setQuantity((prev) => prev + 1)}
            onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
            minValue={1}
            disabled={isSubmitting}
          />
          <div>
            <Button
              className={cn(
                "text-white dark:text-white",
                isSubmitting && "opacity-80"
              )}
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              onClick={handleAddToCart}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add {quantity} to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
