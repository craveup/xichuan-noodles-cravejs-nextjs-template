import type { Product } from "@/lib/api/types";

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  spiceLevel: number // 0-4 scale
  isVegetarian?: boolean
  isVegan?: boolean
  isSignature?: boolean
  isPopular?: boolean
  isSpicy?: boolean
  ingredients?: string[]
  apiProduct?: Product
}

export interface ItemOptions {
  spiceLevel: number // 0-4 scale
  noodleType?: "hand-pulled" | "wide" | "thin"
  extraToppings: string[]
  specialInstructions?: string
}

export interface CartItem extends MenuItem {
  cartId: string
  quantity: number
  options: ItemOptions
}
