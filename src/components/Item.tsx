import React, { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import ItemHorizontal from "@/components/ItemHorizontal";
import ItemVertical from "@/components/ItemVertical";
import { ItemImagesCarousel } from "@/components/product-description/ItemImagesCarousel";
import { ProductDescriptionScreen } from "@/components/product-description/ProductDescriptionScreen";
import type { ItemFormData } from "@/components/product-description/ProductDescriptionScreen";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addCartItem } from "@/lib/api";
import { formatApiError } from "@/lib/format-api-error";
import { useCart } from "@/hooks/useCart";
import CounterButton from "@/components/CounterButton";
import type { AddCartItemPayload } from "@/types";
import { Product } from "@/types/menu-types";
import { LoadingButton } from "./ui/LoadingButton";

export enum ItemUnavailableActions {
  REMOVE_ITEM = "remove_item",
  CANCEL_ENTIRE_ORDER = "cancel_entire_order",
}

interface ItemProps {
  product: Product;
  type?: "vertical" | "horizontal";
  isBlocked?: boolean;
}

function Item({ type = "horizontal", product, isBlocked }: ItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const { cart, mutate } = useCart();
  const toastDurationMs = 600;
  const [modifierErrorGroupId, setModifierErrorGroupId] = useState<string>();
  const hasModifiers =
    (product.modifierIds?.length ?? product.modifiers?.length ?? 0) > 0;

  const hasNutrition =
    Boolean(product.nutrition?.calorieCount) ||
    Boolean(product.nutrition?.dietaryPreferences?.length) ||
    Boolean(product.nutrition?.ingredients?.length);

  function handleOpen() {
    setModifierErrorGroupId(undefined);
    setQty(1);
    setIsOpen(true);
  }

  async function handleClickBtn() {
    if (hasModifiers || isBlocked) {
      setIsOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const addItemData: AddCartItemPayload = {
        productId: product.id,
        quantity: 1,
        specialInstructions: "",
        itemUnavailableAction: ItemUnavailableActions.REMOVE_ITEM,
        selections: [],
      };

      const response = await addCartItem(cart.locationId, cart.id, addItemData);
      toast.success("Item added to cart", { duration: toastDurationMs });
      setIsOpen(false);
      if (response?.cart) {
        await mutate(response.cart, false);
      } else {
        await mutate();
      }
    } catch (error) {
      const formattedError = formatApiError(error);
      toast.error(formattedError.message, { duration: toastDurationMs });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddToCart(formData: ItemFormData) {
    try {
      setIsLoading(true);
      setModifierErrorGroupId(undefined);
      const addItemData: AddCartItemPayload = {
        productId: product.id,
        quantity: qty,
        specialInstructions: formData.specialInstructions,
        itemUnavailableAction: formData.itemUnavailableAction,
        selections: formData.selections ?? [],
      };

      const response = await addCartItem(cart.locationId, cart.id, addItemData);
      toast.success("Item added to cart", { duration: toastDurationMs });
      setIsOpen(false);
      if (response?.cart) {
        await mutate(response.cart, false);
      } else {
        await mutate();
      }
    } catch (error) {
      const formattedError = formatApiError(error);
      toast.error(formattedError.message, { duration: toastDurationMs });
      const modifierGroupId = error.response?.data?.data?.modifierGroupId;
      if (typeof modifierGroupId === "string") {
        setModifierErrorGroupId(modifierGroupId);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const productDetails = (
    <ResponsiveDialog
      formId='product-description-form'
      hideMainBtn={isBlocked}
      hideCloseBtn={isBlocked}
      open={isOpen}
      setOpen={setIsOpen}
      title={product.name}
      rightText={product.displayPrice}
      loading={isLoading}
      footer={
        !isBlocked ? (
          <div className='flex flex-1 items-center gap-2.5'>
            <CounterButton
              quantity={qty}
              disabled={isLoading}
              showTrashAtOne={false}
              onIncrease={() => setQty((q) => Math.max(1, q + 1))}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
            />
            <LoadingButton
              loading={isLoading}
              disabled={isLoading}
              form='product-description-form'
              type='submit'
              size='lg'
              className='flex-1'
            >
              Add to Cart
            </LoadingButton>
          </div>
        ) : null
      }
    >
      {isBlocked && (
        <Alert variant='destructive' className='mb-2.5'>
          <div className='flex items-start gap-2'>
            <Info aria-hidden='true' className='mt-0.5 h-4 w-4' />
            <div>
              <AlertTitle>Unavailable</AlertTitle>
              <AlertDescription>
                {product.name} is currently not available, please try again
                later.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <ItemImagesCarousel images={product.images} />

      <span className='text-muted-foreground mt-4 block px-2 text-sm sm:px-1'>
        {product.description}
      </span>

      {hasNutrition ? (
        <div className='bg-muted/30 text-foreground mt-4 space-y-2 rounded-lg px-3 py-2 text-sm sm:px-2'>
          <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
            Nutritional Information
          </p>
          <div className='space-y-1.5'>
            {typeof product.nutrition?.calorieCount === "number" ? (
              <div className='flex items-baseline gap-1'>
                <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  Calories:
                </span>
                <span className='text-sm'>
                  {product.nutrition.calorieCount.toLocaleString()} kcal
                </span>
              </div>
            ) : null}

            {product.nutrition?.dietaryPreferences?.length ? (
              <div>
                <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  Dietary Preferences
                </p>
                <p className='text-sm'>
                  {product.nutrition.dietaryPreferences.join(", ")}
                </p>
              </div>
            ) : null}

            {product.nutrition?.ingredients?.length ? (
              <div>
                <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  Contains
                </p>
                <p className='text-sm'>
                  {product.nutrition.ingredients.join(", ")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <ProductDescriptionScreen
        productId={product.id}
        isBlocked={isBlocked}
        handleAddToCart={handleAddToCart}
        modifierErrorGroupId={modifierErrorGroupId}
        onModifierGroupInteract={(groupId) => {
          if (!modifierErrorGroupId) return;
          if (!groupId || groupId === modifierErrorGroupId) {
            setModifierErrorGroupId(undefined);
          }
        }}
      />
    </ResponsiveDialog>
  );

  if (type === "horizontal") {
    return (
      <>
        <ItemHorizontal
          product={product}
          onClick={handleOpen}
          handleClickAddBtn={handleClickBtn}
          isLoading={isLoading}
        />

        {productDetails}
      </>
    );
  }

  return (
    <>
      <ItemVertical
        product={product}
        onClick={handleOpen}
        handleClickAddBtn={handleClickBtn}
        isLoading={isLoading}
      />
      {productDetails}
    </>
  );
}

export default Item;
