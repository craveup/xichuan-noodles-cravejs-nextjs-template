import type {
  GetLocationViaSlugType,
  MerchantApiResponse,
  MenuResponse,
  Product,
  StorefrontCart,
} from "./types";
import { storefrontClient } from "@/lib/storefront-client";

const http = storefrontClient.http;

type MenuQueryOptions = {
  menuOnly?: boolean;
};

const buildMenuQuery = (
  orderDate?: string,
  orderTime?: string,
  options: MenuQueryOptions = {},
) => {
  const query: Record<string, string> = {};

  if (orderDate) {
    query.orderDate = orderDate;
  }

  if (orderTime) {
    query.orderTime = orderTime;
  }

  if (options.menuOnly) {
    query.menuOnly = "true";
  }

  return query;
};

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

export async function fetchMenuItems(
  locationId: string,
  orderDate?: string,
  orderTime?: string,
  options?: MenuQueryOptions,
): Promise<MenuResponse> {
  return http.get<MenuResponse>(`/api/v1/locations/${locationId}/menus`, {
    query: buildMenuQuery(orderDate, orderTime, options),
  });
}

export async function fetchProducts(
  locationId: string,
): Promise<Product[]> {
  return http.get<Product[]>(`/api/v1/locations/${locationId}/products`);
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
