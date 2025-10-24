// CraveUp API Integration
export * from './client'
export * from './config'
export * from './hooks'
export * from './types'
export * from './ordering-session'

// Re-export commonly used functions with cleaner names
export {
  fetchMenuItems as getMenu,
  fetchProducts as getProducts,
  fetchLocation as getLocation,
  fetchCart as getCart,
  updateCartItemQuantity as updateQuantity,
  removeCartItem as removeFromCart
} from './client'

export {
  useMenuItems as useMenu,
  useProducts
} from './hooks'
