import type {
  Modifier,
  Product,
  ProductDescription,
  SelectedModifierTypes,
} from "@/lib/api/types";
import { ItemUnavailableActions } from "@craveup/storefront-sdk";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spiceLevel: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSignature?: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  ingredients?: string[];
  apiProduct?: Product;
}

export interface LocalCartItem {
  cartId: string;
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  quantity: number;
  selectionsText?: string;
  specialInstructions?: string;
}

export interface AddToCartProduct {
  id: string;
  name: string;
  description?: string | null;
  images?: string[];
  image?: string | null;
  displayPrice?: string | number | null;
  price?: string | number | null;
  modifiers?: Modifier[] | null;
}

export interface AddToCartRequest {
  product: AddToCartProduct | Product | ProductDescription;
  quantity: number;
  selections: SelectedModifierTypes[];
  specialInstructions?: string;
  itemUnavailableAction: ItemUnavailableActions;
}
