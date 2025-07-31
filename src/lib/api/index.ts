// CraveUp API Integration
export * from './client'
export * from './config'
export * from './hooks'
export * from './types'

// Re-export commonly used functions with cleaner names
export {
  fetchMenuItems as getMenu,
  fetchProducts as getProducts,
  fetchPopularProducts as getPopularProducts,
  fetchLocation as getLocation,
  createCart as newCart,
  fetchCart as getCart,
  addItemToCart as addToCart,
  updateCartItemQuantity as updateQuantity,
  removeCartItem as removeFromCart
} from './client'

export {
  useMenuItems as useMenu,
  useProducts,
  usePopularProducts,
  useLocation,
  useCart,
  usePaymentIntent,
  useDiscountCode
} from './hooks'