"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { CartItem, MenuItem, ItemOptions } from "../types"

interface CartContextType {
  items: CartItem[]
  addToCart: (item: MenuItem & { options: ItemOptions }) => Promise<void>
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  tax: number
  total: number
  isLoading: boolean
  error: string | null
  clearError: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Validation functions
const validateMenuItem = (item: MenuItem & { options: ItemOptions }): void => {
  if (!item.id || !item.name || !item.price) {
    throw new Error('Invalid menu item: missing required fields')
  }
  
  if (typeof item.price !== 'number' || item.price < 0) {
    throw new Error('Invalid menu item: price must be a positive number')
  }
  
  if (!item.options || typeof item.options !== 'object') {
    throw new Error('Invalid menu item: options must be an object')
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const addToCart = useCallback(async (item: MenuItem & { options: ItemOptions }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate the item
      validateMenuItem(item)
      
      const cartItem: CartItem = {
        ...item,
        cartId: `${item.id}-${Date.now()}`,
        quantity: 1,
      }
      
      // Calculate extra charges for toppings
      let extraPrice = 0
      if (item.options.extraToppings && item.options.extraToppings.length > 0) {
        extraPrice = item.options.extraToppings.length * 2.00 // $2 per extra topping
      }
      
      if (extraPrice > 0) {
        cartItem.price += extraPrice
      }
      
      // Simulate potential API call delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      setItems(prevItems => [...prevItems, cartItem])
      
      // Automatically open the cart when an item is added
      setIsCartOpen(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      setError(errorMessage)
      console.error('Error adding item to cart:', err)
      throw err // Re-throw so UI can handle it
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeItem = (cartId: string) => {
    setItems(items.filter(item => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId)
    } else {
      setItems(items.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      ))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08875 // NYC tax rate
  const total = subtotal + tax

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      tax,
      total,
      isLoading,
      error,
      clearError,
      isCartOpen,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}