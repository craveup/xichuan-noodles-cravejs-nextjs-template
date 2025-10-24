import { Currencies } from "@/contracts";
import {Product} from "@/types/menu-types";

export type ModifierItem = {
  id: string;
  name: string;
  price?: string;
};

type Modifier = {
  id: string;
  name: string;
  description: string;
  isFixed: boolean;
  required: boolean;
  quantity: number;
  items: ModifierItem[];
};

export type BundleProduct = {
    id: string;
    name: string;
    price: string;
    displayPrice: string;
    description: string;
    availability: string;
    images: string[];
    currency: Currencies;
    modifierIds: string[];
    modifiers: Modifier[];
};

export type BundleCategory = {
    id: string;
    name: string;
    products: Product[];
};

export type BundleMenu = {
    id: string;
    name: string;
    isActive: boolean;
    time: string;
    // Optional fields tolerated by UI components
    timeRange?: string;
    image?: string;
    description?: string;
    itemCount?: number;
    imageUrl?: string;
    categories: BundleCategory[];
};
