// React hooks for CraveUp API integration
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './client'
import type { Product, Cart, CartItem } from './types'

// Menu hooks
export const useMenuItems = (locationId: string, orderDate?: string, orderTime?: string) => {
  return useQuery({
    queryKey: ['menu', locationId, orderDate, orderTime],
    queryFn: () => api.fetchMenuItems(locationId, orderDate, orderTime),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!locationId,
  })
}

export const useProducts = (locationId: string) => {
  return useQuery({
    queryKey: ['products', locationId],
    queryFn: () => api.fetchProducts(locationId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!locationId,
  })
}

export const usePopularProducts = (locationId: string) => {
  return useQuery({
    queryKey: ['popular-products', locationId],
    queryFn: () => api.fetchPopularProducts(locationId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!locationId,
  })
}

export const useProduct = (locationId: string, productId: string) => {
  return useQuery({
    queryKey: ['product', locationId, productId],
    queryFn: () => api.fetchProduct(locationId, productId),
    staleTime: 10 * 60 * 1000,
    enabled: !!locationId && !!productId,
  })
}

export const useLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['location', locationId],
    queryFn: () => api.fetchLocation(locationId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!locationId,
  })
}

export const useTimeIntervals = (locationId: string) => {
  return useQuery({
    queryKey: ['time-intervals', locationId],
    queryFn: () => api.fetchTimeIntervals(locationId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!locationId,
  })
}

export const useGratuitySettings = (locationId: string) => {
  return useQuery({
    queryKey: ['gratuity', locationId],
    queryFn: () => api.fetchGratuitySettings(locationId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!locationId,
  })
}

// Cart hooks
export const useCart = (locationId: string, cartId: string) => {
  const queryClient = useQueryClient()

  const cartQuery = useQuery({
    queryKey: ['cart', locationId, cartId],
    queryFn: () => api.fetchCart(locationId, cartId),
    enabled: !!locationId && !!cartId,
  })

  const createCartMutation = useMutation({
    mutationFn: () => api.createCart(locationId),
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart', locationId, newCart._id], newCart)
    }
  })

  const updateCartMutation = useMutation({
    mutationFn: (items: CartItem[]) => api.updateCart(locationId, cartId, items),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const deleteCartMutation = useMutation({
    mutationFn: () => api.deleteCart(locationId, cartId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['cart', locationId, cartId] })
    }
  })

  const addItemMutation = useMutation({
    mutationFn: ({ 
      product, 
      quantity = 1, 
      modifiers, 
      specialInstructions 
    }: {
      product: Product
      quantity?: number
      modifiers?: any[]
      specialInstructions?: string
    }) => api.addItemToCart(locationId, cartId, product, quantity, modifiers, specialInstructions),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => 
      api.updateCartItemQuantity(locationId, cartId, itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.removeCartItem(locationId, cartId, itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const updateGratuityMutation = useMutation({
    mutationFn: (gratuity: number) => api.updateCartGratuity(locationId, cartId, gratuity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const setDeliveryAddressMutation = useMutation({
    mutationFn: (address: any) => api.setDeliveryAddress(locationId, cartId, address),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  const validateCartMutation = useMutation({
    mutationFn: (customerData: {
      customerName?: string
      emailAddress?: string
      phoneNumber?: string
    }) => api.validateAndUpdateCart(locationId, cartId, customerData),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', locationId, cartId], updatedCart)
    }
  })

  return {
    // Query data
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    
    // Mutations
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
  }
}

// Payment hooks
export const usePaymentIntent = () => {
  return useMutation({
    mutationFn: ({ locationId, cartId }: { locationId: string; cartId: string }) =>
      api.createPaymentIntent(locationId, cartId),
  })
}

// Discount hooks
export const useDiscountCode = (locationId: string) => {
  const queryClient = useQueryClient()

  const applyDiscountMutation = useMutation({
    mutationFn: ({ code, cartId }: { code: string; cartId: string }) =>
      api.applyDiscountCode(locationId, code, cartId),
    onSuccess: (_, { cartId }) => {
      // Invalidate cart to refetch with discount applied
      queryClient.invalidateQueries({ queryKey: ['cart', locationId, cartId] })
    }
  })

  const removeDiscountMutation = useMutation({
    mutationFn: (cartId: string) => api.removeDiscountCode(locationId, cartId),
    onSuccess: (_, cartId) => {
      // Invalidate cart to refetch without discount
      queryClient.invalidateQueries({ queryKey: ['cart', locationId, cartId] })
    }
  })

  return {
    applyDiscount: applyDiscountMutation.mutate,
    isApplyingDiscount: applyDiscountMutation.isPending,
    applyDiscountError: applyDiscountMutation.error,
    
    removeDiscount: removeDiscountMutation.mutate,
    isRemovingDiscount: removeDiscountMutation.isPending,
    removeDiscountError: removeDiscountMutation.error,
  }
}