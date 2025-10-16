import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "./client";
import type {
  CartItem,
  LocationAddressDTO,
  Product,
  SelectedModifierTypes,
  ValidateAndUpdateCustomerPayload,
} from "./types";

// Menu hooks
export const useMenuItems = (locationId: string, orderDate?: string, orderTime?: string) =>
  useQuery({
    queryKey: ["menu", locationId, orderDate, orderTime],
    queryFn: () => api.fetchMenuItems(locationId, orderDate, orderTime),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(locationId),
  });

export const useProducts = (locationId: string) =>
  useQuery({
    queryKey: ["products", locationId],
    queryFn: () => api.fetchProducts(locationId),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(locationId),
  });

export const usePopularProducts = (locationId: string) =>
  useQuery({
    queryKey: ["popular-products", locationId],
    queryFn: () => api.fetchPopularProducts(locationId),
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(locationId),
  });

export const useProduct = (locationId: string, productId: string) =>
  useQuery({
    queryKey: ["product", locationId, productId],
    queryFn: () => api.fetchProduct(locationId, productId),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(locationId && productId),
  });

export const useLocation = (locationId: string) =>
  useQuery({
    queryKey: ["location", locationId],
    queryFn: () => api.fetchLocation(locationId),
    staleTime: 60 * 60 * 1000,
    enabled: Boolean(locationId),
  });

export const useTimeIntervals = (locationId: string) =>
  useQuery({
    queryKey: ["time-intervals", locationId],
    queryFn: () => api.fetchTimeIntervals(locationId),
    staleTime: 30 * 60 * 1000,
    enabled: Boolean(locationId),
  });

export const useGratuitySettings = (locationId: string) =>
  useQuery({
    queryKey: ["gratuity", locationId],
    queryFn: () => api.fetchGratuitySettings(locationId),
    staleTime: 60 * 60 * 1000,
    enabled: Boolean(locationId),
  });

// Cart hooks
export const useCart = (locationId: string, cartId: string) => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart", locationId, cartId],
    queryFn: () => api.fetchCart(locationId, cartId),
    enabled: Boolean(locationId && cartId),
  });

  const handleCartSuccess = (updatedCart: Awaited<ReturnType<typeof api.fetchCart>>) => {
    if (updatedCart) {
      queryClient.setQueryData(["cart", locationId, updatedCart.id], updatedCart);
    }
  };

  const createCartMutation = useMutation({
    mutationFn: () => api.createCart(locationId),
    onSuccess: handleCartSuccess,
  });

  const updateCartMutation = useMutation({
    mutationFn: (items: CartItem[]) => api.updateCart(locationId, cartId, items),
    onSuccess: handleCartSuccess,
  });

  const deleteCartMutation = useMutation({
    mutationFn: () => api.deleteCart(locationId, cartId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["cart", locationId, cartId] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: ({
      product,
      quantity = 1,
      modifiers,
      specialInstructions,
    }: {
      product: Product;
      quantity?: number;
      modifiers?: SelectedModifierTypes[];
      specialInstructions?: string;
    }) =>
      api.addItemToCart(locationId, cartId, product, quantity, modifiers, specialInstructions),
    onSuccess: handleCartSuccess,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.updateCartItemQuantity(locationId, cartId, itemId, quantity),
    onSuccess: handleCartSuccess,
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.removeCartItem(locationId, cartId, itemId),
    onSuccess: handleCartSuccess,
  });

  const updateGratuityMutation = useMutation({
    mutationFn: (gratuityAmount: number) =>
      api.updateCartGratuity(locationId, cartId, { amount: gratuityAmount.toFixed(2) }),
    onSuccess: handleCartSuccess,
  });

  const setDeliveryAddressMutation = useMutation({
    mutationFn: (address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      apt?: string;
      country?: string;
      lat?: number;
      lng?: number;
    }) => {
      const payload: LocationAddressDTO = {
        street: address.street,
        streetOptional: address.apt,
        city: address.city,
        state: address.state,
        zipCode: address.zip,
        country: address.country ?? "US",
        lat: address.lat ?? 0,
        lng: address.lng ?? 0,
      };

      return api.setDeliveryAddress(locationId, cartId, payload);
    },
    onSuccess: handleCartSuccess,
  });

  const validateCartMutation = useMutation({
    mutationFn: (customerData: ValidateAndUpdateCustomerPayload) =>
      api.validateAndUpdateCart(locationId, cartId, customerData),
    onSuccess: handleCartSuccess,
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    createCart: createCartMutation.mutate,
    isCreatingCart: createCartMutation.isPending,
    updateCart: updateCartMutation.mutate,
    isUpdatingCart: updateCartMutation.isPending,
    deleteCart: deleteCartMutation.mutate,
    isDeletingCart: deleteCartMutation.isPending,
    addItem: addItemMutation.mutate,
    isAddingItem: addItemMutation.isPending,
    updateQuantity: updateQuantityMutation.mutate,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemovingItem: removeItemMutation.isPending,
    updateGratuity: updateGratuityMutation.mutate,
    isUpdatingGratuity: updateGratuityMutation.isPending,
    setDeliveryAddress: setDeliveryAddressMutation.mutate,
    isSettingAddress: setDeliveryAddressMutation.isPending,
    validateCart: validateCartMutation.mutate,
    isValidatingCart: validateCartMutation.isPending,
  };
};

// Payment hooks
export const usePaymentIntent = () =>
  useMutation({
    mutationFn: ({ locationId, cartId }: { locationId: string; cartId: string }) =>
      api.createPaymentIntent(locationId, cartId),
  });

// Discount hooks
export const useDiscountCode = (locationId: string) => {
  const queryClient = useQueryClient();

  const handleDiscountSuccess = (updatedCart: Awaited<ReturnType<typeof api.fetchCart>>) => {
    if (updatedCart) {
      queryClient.setQueryData(["cart", locationId, updatedCart.id], updatedCart);
    }
  };

  const applyDiscountMutation = useMutation({
    mutationFn: ({ code, cartId }: { code: string; cartId: string }) =>
      api.applyDiscountCode(locationId, { code, cartId }),
    onSuccess: (updatedCart) => {
      handleDiscountSuccess(updatedCart);
    },
  });

  const removeDiscountMutation = useMutation({
    mutationFn: (cartId: string) => api.removeDiscountCode(locationId, cartId),
    onSuccess: (updatedCart) => {
      handleDiscountSuccess(updatedCart);
    },
  });

  return {
    applyDiscount: applyDiscountMutation.mutate,
    isApplyingDiscount: applyDiscountMutation.isPending,
    applyDiscountError: applyDiscountMutation.error,
    removeDiscount: removeDiscountMutation.mutate,
    isRemovingDiscount: removeDiscountMutation.isPending,
    removeDiscountError: removeDiscountMutation.error,
  };
};
