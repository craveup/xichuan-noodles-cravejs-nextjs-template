import type {
  GetLocationViaSlugType,
  MerchantApiResponse,
  StorefrontCart,
} from "./types";
import { storefrontClient } from "@/lib/storefront-client";

export async function fetchLocation(
  locationId: string,
): Promise<GetLocationViaSlugType> {
  return storefrontClient.locations.getById(locationId);
}

export async function fetchMerchant(
  slug: string,
): Promise<MerchantApiResponse> {
  return storefrontClient.merchant.getBySlug(slug);
}

export async function fetchCart(
  locationId: string,
  cartId: string,
): Promise<StorefrontCart> {
  return storefrontClient.cart.get(locationId, cartId);
}

export async function updateCartItemQuantity(
  locationId: string,
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<StorefrontCart> {
  return storefrontClient.cart.updateItemQuantity(
    locationId,
    cartId,
    itemId,
    quantity,
  );
}

export async function removeCartItem(
  locationId: string,
  cartId: string,
  itemId: string,
): Promise<StorefrontCart> {
  return storefrontClient.cart.updateItemQuantity(
    locationId,
    cartId,
    itemId,
    0,
  );
}

export async function deleteCart(locationId: string, cartId: string) {
  await storefrontClient.cart.delete(locationId, cartId);
}
