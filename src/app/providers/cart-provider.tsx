"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  StorefrontCart,
  CartItem as ApiCartItem,
  CartModifierGroup,
  Modifier,
  SelectedModifierTypes,
} from "@/lib/api/types";
import {
  deleteCart as deleteCartApi,
  fetchCart,
  fetchLocation,
  fetchMerchant,
  removeCartItem as removeCartItemApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
} from "@/lib/api/client";
import { AddToCartRequest, LocalCartItem } from "../types";
import { storefrontClient } from "@/lib/storefront-client";
import { FulfilmentMethods } from "@craveup/storefront-sdk";
import { toErrorMessage } from "@/lib/api/error-utils";
import {
  getStoredCartId,
  setStoredCartId,
  storageKeyForLocation,
} from "@/lib/cart-storage";
import { useCart as useCartResource } from "@/hooks/useCart";
import { useOrderingSession } from "@/hooks/use-ordering-session";
import { startOrderingSession } from "@/lib/api/ordering-session";

type CartLineItem = LocalCartItem;

interface CartContextType {
  cart: StorefrontCart | null;
  items: CartLineItem[];
  addToCart: (request: AddToCartRequest) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  checkoutUrl: string | null;
  isLoading: boolean;
  busyItemId: string | null;
  error: string | null;
  clearError: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  locationId: string | null;
  organizationSlug: string | null;
  isResolvingLocation: boolean;
  locationError: string | null;
  usingApi: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ORGANIZATION_SLUG = process.env.NEXT_PUBLIC_ORG_SLUG?.trim() ?? "";
const DEFAULT_FALLBACK_IMAGE =
  "/images/xichuan-noodles/menu/biang_classic.webp";
const DEFAULT_FULFILLMENT_METHOD = FulfilmentMethods.TAKEOUT;

const resolveProductImage = (item: ApiCartItem) => {
  const product = (item as { product?: { imageUrl?: string; image?: string } })
    .product;
  if (
    product &&
    typeof product.imageUrl === "string" &&
    product.imageUrl.trim().length > 0
  ) {
    return product.imageUrl;
  }
  if (product && typeof product.image === "string" && product.image.trim()) {
    return product.image;
  }
  return undefined;
};

const parseAmount = (value?: string) => (value ? Number.parseFloat(value) : 0);

const toPriceNumber = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const sanitized = value.replace(/[^0-9.+-]/g, "");
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCartSelections = (
  groups: CartModifierGroup[] | undefined
): string | undefined => {
  if (!Array.isArray(groups) || groups.length === 0) return undefined;

  const parts: string[] = [];

  const visit = (collection: CartModifierGroup[]) => {
    collection.forEach((group) => {
      const itemsLabel = group.items
        .map((item) => {
          const quantityPrefix = item.quantity > 1 ? `${item.quantity}x ` : "";
          return `${quantityPrefix}${item.name}`;
        })
        .filter(Boolean)
        .join(", ");

      if (itemsLabel) {
        parts.push(`${group.name}: ${itemsLabel}`);
      }

      group.items.forEach((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          visit(item.children);
        }
      });
    });
  };

  visit(groups);
  return parts.join(" | ") || undefined;
};

const buildModifierLookup = (
  modifiers?: Modifier[] | null
): Map<string, Modifier> => {
  const lookup = new Map<string, Modifier>();
  const visit = (group: Modifier | null | undefined) => {
    if (!group) return;
    if (!lookup.has(group.id)) {
      lookup.set(group.id, group);
    }
    group.items.forEach((item) => {
      item.childGroups?.forEach((link) => {
        visit(link.group ?? null);
      });
    });
  };

  modifiers?.forEach((group) => visit(group));
  return lookup;
};

const formatClientSelections = (
  product: { modifiers?: Modifier[] | null | undefined },
  selections: SelectedModifierTypes[]
): string | undefined => {
  if (!Array.isArray(selections) || selections.length === 0) return undefined;
  if (!Array.isArray(product.modifiers) || product.modifiers.length === 0) {
    return undefined;
  }

  const lookup = buildModifierLookup(product.modifiers);
  const parts: string[] = [];

  const visit = (selection: SelectedModifierTypes) => {
    const group = lookup.get(selection.groupId);
    const groupName = group?.name ?? selection.groupId;
    const optionLabels = selection.selectedOptions.map((option) => {
      const optionMeta = group?.items.find((item) => item.id === option.optionId);
      const label = optionMeta?.name ?? option.optionId;
      const quantityPrefix = option.quantity > 1 ? `${option.quantity}x ` : "";
      if (Array.isArray(option.children)) {
        option.children.forEach((child) => visit(child));
      }
      return `${quantityPrefix}${label}`;
    });

    if (optionLabels.length > 0) {
      parts.push(`${groupName}: ${optionLabels.join(", ")}`);
    }
  };

  selections.forEach((selection) => visit(selection));

  return parts.join(" | ") || undefined;
};

const calculateModifierSelectionsTotal = (
  product: { modifiers?: Modifier[] | null | undefined },
  selections: SelectedModifierTypes[]
): number => {
  if (!Array.isArray(selections) || selections.length === 0) return 0;
  if (!Array.isArray(product.modifiers) || product.modifiers.length === 0) {
    return 0;
  }

  const lookup = buildModifierLookup(product.modifiers);

  const computeGroupTotal = (
    selection: SelectedModifierTypes,
    multiplier: number
  ): number => {
    const group = lookup.get(selection.groupId);
    if (!group) return 0;

    return selection.selectedOptions.reduce((sum, optionSelection) => {
      const option = group.items.find((item) => item.id === optionSelection.optionId);
      const quantity = Math.max(optionSelection.quantity ?? 1, 1);
      const optionUnitPrice =
        option && (typeof option.price === "string" || typeof option.price === "number")
          ? toPriceNumber(option.price)
          : 0;
      const optionTotal = optionUnitPrice * quantity * multiplier;

      const childrenTotal = Array.isArray(optionSelection.children)
        ? optionSelection.children.reduce((childSum, childSelection) => {
            const childLink = option?.childGroups?.find(
              (link) => link.groupId === childSelection.groupId
            );
            const nextMultiplier = childLink
              ? multiplier * (childLink.applyPerParentQuantity ? quantity : 1)
              : multiplier;
            return childSum + computeGroupTotal(childSelection, nextMultiplier);
          }, 0)
        : 0;

      return sum + optionTotal + childrenTotal;
    }, 0);
  };

  return selections.reduce(
    (total, selection) => total + computeGroupTotal(selection, 1),
    0
  );
};

const mapApiItemToCartLine = (item: ApiCartItem): CartLineItem => {
  const unitPrice = parseAmount(item.price);
  const totalPrice = parseAmount(item.total);
  const derivedUnitPrice =
    totalPrice > 0 && item.quantity > 0 ? totalPrice / item.quantity : 0;

  let resolvedPrice = unitPrice;
  if (derivedUnitPrice > 0) {
    if (unitPrice <= 0) {
      resolvedPrice = derivedUnitPrice;
    } else {
      const delta = Math.abs(derivedUnitPrice - unitPrice);
      if (delta > 0.009) {
        resolvedPrice = derivedUnitPrice;
      }
    }
  }

  return {
    cartId: item.id,
    id: item.productId,
    name: item.name,
    description: item.description,
    price: resolvedPrice,
    image:
      item.imageUrl ||
      resolveProductImage(item) ||
      DEFAULT_FALLBACK_IMAGE,
    quantity: item.quantity,
    selectionsText: formatCartSelections(item.selections),
    specialInstructions: item.specialInstructions ?? undefined,
  };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const organizationSlug = ORGANIZATION_SLUG || null;
  const [locationId, setLocationId] = useState<string | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState<boolean>(
    () => Boolean(organizationSlug)
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationSlug) {
      if (locationId !== null) {
        setLocationId(null);
      }
      setLocationError(null);
      setIsResolvingLocation(false);
      return;
    }

    const slug = organizationSlug;

    if (locationId) {
      setIsResolvingLocation(false);
      setLocationError(null);
      return;
    }

    let cancelled = false;

    async function resolveLocation() {
      setIsResolvingLocation(true);
      setLocationError(null);

      let resolvedId: string | null = null;
      let failure: unknown = null;

      try {
        const location = await fetchLocation(slug);
        if (location?.id) {
          resolvedId = location.id;
        }
      } catch (error) {
        failure = error;
      }

      if (!resolvedId) {
        try {
          const merchant = await fetchMerchant(slug);
          const candidate =
            merchant.locations?.find(
              (loc) =>
                Boolean(
                  (loc as { isMainLocation?: boolean }).isMainLocation
                )
            ) ?? merchant.locations?.[0];

          if (candidate?.id) {
            resolvedId = candidate.id;
          } else if (!failure) {
            failure = new Error("No active locations found for this merchant.");
          }
        } catch (error) {
          failure = error;
        }
      }

      if (cancelled) {
        return;
      }

      if (resolvedId) {
        setLocationId(resolvedId);
        setLocationError(null);
      } else if (failure) {
        setLocationId(null);
        setLocationError(toErrorMessage(failure));
        console.error("[cart] failed to resolve location", failure);
      } else {
        setLocationId(null);
        setLocationError("Unable to resolve location from configuration.");
      }

      setIsResolvingLocation(false);
    }

    void resolveLocation();

    return () => {
      cancelled = true;
    };
  }, [organizationSlug, locationId]);

  const preferApi = Boolean(locationId) && !isResolvingLocation;
  const [apiEnabled, setApiEnabled] = useState(preferApi);

  useEffect(() => {
    if (preferApi) {
      setApiEnabled(true);
    }
  }, [preferApi]);

  const usingApi = apiEnabled && Boolean(locationId) && !isResolvingLocation;
  const resolvedOrganizationSlug =
    organizationSlug && organizationSlug === locationId ? null : organizationSlug;

  const [cartId, setCartId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  const storageKey = useMemo(
    () => (locationId ? storageKeyForLocation(locationId) : null),
    [locationId]
  );

  const {
    cart: apiCart,
    cartId: hookCartId,
    isLoading: cartQueryLoading,
    setCartIdState: setHookCartId,
  } = useCartResource({
    locationId: locationId ?? undefined,
    shouldFetch: usingApi,
  });

  const {
    cartId: sessionCartId,
    isLoading: orderingSessionLoading,
    error: orderingSessionError,
  } = useOrderingSession(usingApi && locationId ? locationId : null);

  useEffect(() => {
    if (!usingApi) return;
    if (hookCartId === cartId) return;
    setCartId(hookCartId ?? null);
  }, [cartId, hookCartId, usingApi]);

  useEffect(() => {
    if (!usingApi) return;
    if (!sessionCartId) return;
    if (sessionCartId === cartId) return;
    setCartId(sessionCartId);
    setHookCartId(sessionCartId);
  }, [cartId, sessionCartId, setHookCartId, usingApi]);

  useEffect(() => {
    if (!usingApi || !storageKey) return;

    if (typeof window === "undefined") return;

    const storedId = locationId ? getStoredCartId(locationId) : null;
    if (storedId) {
      setCartId(storedId);
    }
  }, [locationId, storageKey, usingApi]);

  useEffect(() => {
    if (!usingApi) {
      setCartId(null);
    }
  }, [usingApi]);

  const refreshCart = useCallback(
    (cart: StorefrontCart | null) => {
      if (!locationId) return;

      if (cart) {
        queryClient.setQueryData(["cart", locationId, cart.id], cart);
        setCartId(cart.id);
        setHookCartId(cart.id);
        setLocalItems(cart.items.map(mapApiItemToCartLine));
        if (storageKey && typeof window !== "undefined") {
          setStoredCartId(locationId, cart.id);
        }
      } else if (cartId) {
        queryClient.removeQueries({ queryKey: ["cart", locationId, cartId] });
        if (storageKey && typeof window !== "undefined") {
          setStoredCartId(locationId, null);
        }
        setCartId(null);
        setHookCartId(null);
        setLocalItems([]);
      }
    },
    [cartId, locationId, queryClient, setHookCartId, storageKey]
  );

  const seedLocalCartFromApi = useCallback(() => {
    if (!apiCart) return;
    setLocalItems(apiCart.items.map(mapApiItemToCartLine));
  }, [apiCart]);

  const handleApiFailure = useCallback(
    (err: unknown) => {
      seedLocalCartFromApi();
      refreshCart(null);
      setApiEnabled(false);
      setError(toErrorMessage(err));
    },
    [refreshCart, seedLocalCartFromApi]
  );

  const ensureCart = useCallback(async () => {
    if (!usingApi) {
      return null;
    }

    if (cartId) {
      return cartId;
    }

    if (sessionCartId) {
      return sessionCartId;
    }

    if (!locationId) {
      throw new Error("Location ID is required to create a cart.");
    }

    let persistedId: string | null = null;
    if (storageKey && typeof window !== "undefined") {
      persistedId = getStoredCartId(locationId);
    }

    setIsMutating(true);
    try {
      const response = await startOrderingSession(locationId, {
        existingCartId: persistedId,
        fulfillmentMethod: String(DEFAULT_FULFILLMENT_METHOD),
      });

      const nextCartId = response.cartId || persistedId;
      if (!nextCartId) {
        throw new Error(
          response.errorMessage || "Unable to initialize cart session."
        );
      }

      const cart = await fetchCart(locationId, nextCartId);
      refreshCart(cart);
      setApiEnabled(true);
      setError(null);
      return nextCartId;
    } catch (err) {
      handleApiFailure(err);
      return null;
    } finally {
      setIsMutating(false);
    }
  }, [
    cartId,
    handleApiFailure,
    locationId,
    refreshCart,
    sessionCartId,
    storageKey,
    usingApi,
  ]);

  const fallbackAddToCart = useCallback(
    (request: AddToCartRequest) => {
      const { product, quantity, selections, specialInstructions } = request;
      const productWithModifiers = {
        modifiers: (product as { modifiers?: Modifier[] | null }).modifiers,
      };
      const selectionSummary = formatClientSelections(
        productWithModifiers,
        selections
      );
      const specialInstructionsTrimmed = specialInstructions
        ? specialInstructions.trim()
        : undefined;
      const rawPriceCandidate =
        (product as { displayPrice?: string | number | null }).displayPrice ??
        (product as { price?: string | number | null }).price;
      const basePrice = toPriceNumber(
        typeof rawPriceCandidate === "string" || typeof rawPriceCandidate === "number"
          ? rawPriceCandidate
          : undefined
      );
      const modifiersPrice = calculateModifierSelectionsTotal(
        productWithModifiers,
        selections
      );
      const unitPriceRaw = basePrice + modifiersPrice;
      const resolvedPrice = Number.isFinite(unitPriceRaw)
        ? Math.round(unitPriceRaw * 100) / 100
        : basePrice;
      const images = (product as { images?: string[] | null }).images ?? [];
      const primaryImage =
        (Array.isArray(images) && images.length > 0 ? images[0] : undefined) ??
        DEFAULT_FALLBACK_IMAGE;

      setLocalItems((prevItems) => {
        const existing = prevItems.find(
          (line) =>
            line.id === product.id &&
            line.selectionsText === selectionSummary &&
            line.specialInstructions === specialInstructionsTrimmed
        );

        if (existing) {
          return prevItems.map((line) =>
            line.cartId === existing.cartId
              ? {
                  ...line,
                  quantity: line.quantity + quantity,
                  price: resolvedPrice,
                }
              : line
          );
        }

        const cartItem: CartLineItem = {
          cartId: `${product.id}-${Date.now()}`,
          id: product.id,
          name: product.name,
          description:
            (product as { description?: string | null }).description ?? "",
          image: primaryImage,
          price: resolvedPrice,
          quantity,
          selectionsText: selectionSummary,
          specialInstructions: specialInstructionsTrimmed,
        };

        return [...prevItems, cartItem];
      });
    },
    []
  );

  const addToCart = useCallback(
    async (request: AddToCartRequest) => {
      setError(null);

      if (!usingApi) {
        fallbackAddToCart(request);
        setIsCartOpen(true);
        return;
      }

      const targetCartId = await ensureCart();
      if (!targetCartId) {
        fallbackAddToCart(request);
        setIsCartOpen(true);
        return;
      }

      const activeLocationId = locationId;
      if (!activeLocationId) {
        fallbackAddToCart(request);
        setIsCartOpen(true);
        return;
      }

      setIsMutating(true);
      try {
        const response = await storefrontClient.cart.addItem(
          activeLocationId,
          targetCartId,
          {
            productId: request.product.id,
            quantity: request.quantity,
            specialInstructions: request.specialInstructions?.trim() ?? "",
            itemUnavailableAction: request.itemUnavailableAction,
            selections: request.selections,
          }
        );

        const updatedCart =
          response.cart ?? (await fetchCart(activeLocationId, targetCartId));

        refreshCart(updatedCart);
        setApiEnabled(true);
        setError(null);
        setIsCartOpen(true);
      } catch (err) {
        handleApiFailure(err);
        fallbackAddToCart(request);
        setIsCartOpen(true);
      } finally {
        setIsMutating(false);
      }
    },
    [
      ensureCart,
      fallbackAddToCart,
      handleApiFailure,
      locationId,
      refreshCart,
      usingApi,
    ]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      setError(null);
      setBusyItemId(cartItemId);

      if (!usingApi || !cartId || !locationId) {
        setLocalItems((prev) =>
          prev.filter((item) => item.cartId !== cartItemId)
        );
        setBusyItemId(null);
        return;
      }

      const activeLocationId = locationId;
      const activeCartId = cartId;

      setIsMutating(true);
      try {
        const updatedCart = await removeCartItemApi(
          activeLocationId,
          activeCartId,
          cartItemId
        );
        refreshCart(updatedCart);
      } catch (err) {
        handleApiFailure(err);
      } finally {
        setIsMutating(false);
        setBusyItemId(null);
      }
    },
    [cartId, handleApiFailure, locationId, refreshCart, usingApi]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      setError(null);
      setBusyItemId(cartItemId);

      if (quantity <= 0) {
        await removeItem(cartItemId);
        setBusyItemId(null);
        return;
      }

      if (!usingApi || !cartId || !locationId) {
        setLocalItems((prev) =>
          prev.map((item) =>
            item.cartId === cartItemId ? { ...item, quantity } : item
          )
        );
        setBusyItemId(null);
        return;
      }

      const activeLocationId = locationId;
      const activeCartId = cartId;

      setIsMutating(true);
      try {
        const updatedCart = await updateCartItemQuantityApi(
          activeLocationId,
          activeCartId,
          cartItemId,
          quantity
        );
        refreshCart(updatedCart);
      } catch (err) {
        handleApiFailure(err);
      } finally {
        setIsMutating(false);
        setBusyItemId(null);
      }
    },
    [cartId, handleApiFailure, locationId, refreshCart, removeItem, usingApi]
  );

  const clearCart = useCallback(async () => {
    setError(null);
    setBusyItemId(null);

    if (!usingApi || !cartId || !locationId) {
      setLocalItems([]);
      return;
    }

    const activeLocationId = locationId;
    const activeCartId = cartId;

    setIsMutating(true);
    try {
      await deleteCartApi(activeLocationId, activeCartId);
      refreshCart(null);
      setLocalItems([]);
    } catch (err) {
      handleApiFailure(err);
    } finally {
      setIsMutating(false);
      setBusyItemId(null);
    }
  }, [cartId, handleApiFailure, locationId, refreshCart, usingApi]);

  const items = useMemo<CartLineItem[]>(() => {
    if (usingApi && apiCart) {
      return apiCart.items.map(mapApiItemToCartLine);
    }
    return localItems;
  }, [apiCart, localItems, usingApi]);

  const derivedItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const lineItemsTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(() => {
    if (usingApi && apiCart) {
      const apiQuantity = apiCart.totalQuantity ?? 0;
      if (derivedItemCount > 0 && apiQuantity <= 0) {
        return derivedItemCount;
      }
      return apiQuantity;
    }
    return derivedItemCount;
  }, [apiCart, derivedItemCount, usingApi]);

  const subtotal = useMemo(() => {
    if (usingApi && apiCart) {
      const apiSubtotal = parseAmount(apiCart.subTotal);
      const hasValidApiSubtotal = Number.isFinite(apiSubtotal) && apiSubtotal > 0;
      if (hasValidApiSubtotal) {
        const delta = Math.abs(apiSubtotal - lineItemsTotal);
        if (delta <= 0.01) {
          return apiSubtotal;
        }
      }
    }
    return lineItemsTotal;
  }, [apiCart, lineItemsTotal, usingApi]);

  const total = useMemo(() => {
    if (usingApi && apiCart) {
      const apiSubtotal = parseAmount(apiCart.subTotal);
      const hasValidApiSubtotal = Number.isFinite(apiSubtotal) && apiSubtotal > 0;
      if (hasValidApiSubtotal) {
        const delta = Math.abs(apiSubtotal - lineItemsTotal);
        if (delta <= 0.01) {
          return apiSubtotal;
        }
      }
    }
    return lineItemsTotal;
  }, [apiCart, lineItemsTotal, usingApi]);

  const tax = 0;

  const checkoutUrl = useMemo(() => {
    const raw =
      apiCart && typeof apiCart === "object" && "checkoutUrl" in apiCart
        ? (apiCart as { checkoutUrl?: string }).checkoutUrl
        : undefined;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }

    return null;
  }, [apiCart]);

  const awaitingInitialCart =
    usingApi &&
    (cartQueryLoading || orderingSessionLoading) &&
    !apiCart &&
    items.length === 0;

  const isCartWideMutation = isMutating && !busyItemId;
  const isLoading = isResolvingLocation || awaitingInitialCart || isCartWideMutation;

  const sessionErrorMessage =
    orderingSessionError && orderingSessionError.trim().length > 0
      ? orderingSessionError
      : null;

  const combinedError = error ?? sessionErrorMessage;

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const clearError = useCallback(() => setError(null), []);

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart: apiCart ?? null,
      items,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      tax,
      total,
      checkoutUrl,
      isLoading,
      busyItemId,
      error: combinedError,
      clearError,
      isCartOpen,
      openCart,
      closeCart,
      locationId,
      organizationSlug: resolvedOrganizationSlug,
      isResolvingLocation,
      locationError,
      usingApi,
    }),
    [
      addToCart,
      apiCart,
      clearCart,
      clearError,
      combinedError,
      isCartOpen,
      isLoading,
      itemCount,
      items,
      closeCart,
      openCart,
      checkoutUrl,
      busyItemId,
      removeItem,
      locationId,
      resolvedOrganizationSlug,
      isResolvingLocation,
      locationError,
      subtotal,
      tax,
      total,
      updateQuantity,
      usingApi,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
