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
import { ArrowLeft } from "lucide-react";
import ModifierGroup from "./ModifierGroup";
import ItemCounterButton from "./ItemCounterButton";
import ItemUnavailableAction from "./ItemUnavailableAction";
import SpecialInstructions from "./SpecialInstructions";
import { useCart } from "../../providers/cart-provider";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatMoney, Currencies } from "@/lib/currency";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";

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
  const [errorGroupId, setErrorGroupId] = useState<string | null>(null);

  const modifierLookup = useMemo(
    () => buildModifierLookup(product.modifiers ?? []),
    [product.modifiers]
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const productImage = product.images?.[0] ?? imagePlaceholder;
  const priceLabel = (() => {
    const raw = product.displayPrice ?? product.price ?? "";
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed.length === 0) return "";
      if (!trimmed.includes(" ") && !trimmed.includes("-")) {
        const formatted = formatMoney(trimmed, Currencies.USD);
        if (formatted.trim().length > 0) return formatted;
      }
      return trimmed;
    }

    const formattedNumeric = formatMoney(raw, Currencies.USD);
    if (formattedNumeric.trim().length > 0) return formattedNumeric;

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

      toast.error(formatRuleError(group));

      return false;
    }

    if (selection) {
      for (const option of selection.selectedOptions) {
        if (Array.isArray(option.children)) {
          for (const child of option.children) {
            if (!validateGroup(child.groupId)) return false;
          }
        }
      }
    }

    return true;
  };

  const validateSelections = () => {
    if (!Array.isArray(product.modifiers) || product.modifiers.length === 0)
      return true;
    for (const group of product.modifiers) {
      if (!validateGroup(group.id)) return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    setErrorGroupId(null);

    if (!validateSelections()) return;

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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div
        className="flex-1 overflow-auto scrollbar-hide"
        id="product-description-section"
      >
        <div className="relative">
          <div
            className={cn(
              "relative overflow-hidden border-b border-muted/40 bg-muted/10",
              productImage ? "h-[400px]" : "h-16"
            )}
          >
            {productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={imagePlaceholder}
                sizes="(max-width: 768px) 100vw, 720px"
              />
            ) : null}

            {!isDesktop && (
              <Button
                onClick={onClose}
                className="absolute left-4 top-4 rounded-full bg-black/40 text-white backdrop-blur"
                size="icon"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 pt-6">
          <p className="text-3xl font-semibold text-foreground">
            {product.name}
          </p>

          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground/80">
              {product.description}
            </p>
          )}
        </div>

        <Separator className="mx-4" />

        <div className="px-4 py-4 space-y-6">
          <ModifierGroup
            modifiers={product.modifiers ?? []}
            selections={selections}
            setSelections={setSelections}
            disabled={isSubmitting}
            errorModifierGroupId={errorGroupId ?? undefined}
            onGroupInteract={(groupId) => {
              if (groupId === errorGroupId) {
                setErrorGroupId(null);
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
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <ItemCounterButton
            value={quantity}
            onIncrease={() => setQuantity((prev) => prev + 1)}
            onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
            minValue={1}
            disabled={isSubmitting}
          />
          <div>
            <LoadingButton
              type="button"
              className={cn("w-40", isSubmitting && "opacity-80")}
              onClick={handleAddToCart}
              loading={isSubmitting}
            >
              Add {quantity} to cart
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
