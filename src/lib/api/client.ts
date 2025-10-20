import type {
  AddCartItemPayload,
  CartItem,
  GetLocationViaSlugType,
  LocationAddressDTO,
  MerchantApiResponse,
  MenuResponse,
  PaymentIntent,
  Product,
  SelectedModifierTypes,
  StorefrontCart,
  TimeInterval,
  UpdateGratuityPayload,
  UpdateOrderTimePayload,
  ValidateAndUpdateCustomerPayload,
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

export async function fetchLocation(locationId: string): Promise<GetLocationViaSlugType> {
  return storefrontClient.locations.getById(locationId);
}

export async function fetchMerchant(slug: string): Promise<MerchantApiResponse> {
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

export async function fetchProducts(locationId: string): Promise<Product[]> {
  return http.get<Product[]>(`/api/v1/locations/${locationId}/products`);
}

export async function fetchPopularProducts(locationId: string): Promise<Product[]> {
  return http.get<Product[]>(`/api/v1/locations/${locationId}/products/popular`);
}

export async function fetchProduct(locationId: string, productId: string): Promise<Product> {
  return http.get<Product>(`/api/v1/locations/${locationId}/products/${productId}`);
}

export async function fetchTimeIntervals(locationId: string): Promise<TimeInterval[]> {
  const response = await storefrontClient.locations.getOrderTimes(locationId);
  return response.orderDays;
}

export async function fetchGratuitySettings(locationId: string) {
  return storefrontClient.locations.getGratuity(locationId);
}

export async function createCart(locationId: string, currentCartId = ""): Promise<StorefrontCart> {
  const payload = {
    marketplaceId: null,
    currentCartId,
  };

  const response = await http.post<{ cartId: string }>(`/api/v1/locations/${locationId}/carts`, payload);

  if (response?.cartId) {
    return fetchCart(locationId, response.cartId);
  }

  // some environments return full cart body already
  return response as unknown as StorefrontCart;
}

export async function fetchCart(locationId: string, cartId: string): Promise<StorefrontCart> {
  return storefrontClient.cart.get(locationId, cartId);
}

export async function updateCart(locationId: string, cartId: string, items: CartItem[]): Promise<StorefrontCart> {
  return http.patch<StorefrontCart>(`/api/v1/locations/${locationId}/carts/${cartId}`, { items });
}

export async function deleteCart(locationId: string, cartId: string): Promise<void> {
  await storefrontClient.cart.delete(locationId, cartId);
}

export async function updateCartGratuity(
  locationId: string,
  cartId: string,
  payload: UpdateGratuityPayload,
): Promise<StorefrontCart> {
  await storefrontClient.cart.updateGratuity(locationId, cartId, payload);
  return fetchCart(locationId, cartId);
}

export async function setDeliveryAddress(
  locationId: string,
  cartId: string,
  address: LocationAddressDTO,
): Promise<StorefrontCart> {
  await storefrontClient.cart.setDelivery(locationId, cartId, address);
  return fetchCart(locationId, cartId);
}

export async function setTableInfo(
  locationId: string,
  cartId: string,
  tableNumber: string,
): Promise<StorefrontCart> {
  await storefrontClient.cart.setTable(locationId, cartId, tableNumber);
  return fetchCart(locationId, cartId);
}

export async function setRoomServiceInfo(
  locationId: string,
  cartId: string,
  payload: { lastName: string; roomNumber: string },
): Promise<StorefrontCart> {
  await storefrontClient.cart.setRoom(locationId, cartId, payload);
  return fetchCart(locationId, cartId);
}

export async function updateOrderTime(
  locationId: string,
  cartId: string,
  payload: UpdateOrderTimePayload,
): Promise<StorefrontCart> {
  await storefrontClient.cart.updateOrderTime(locationId, cartId, payload);
  return fetchCart(locationId, cartId);
}

export async function validateAndUpdateCart(
  locationId: string,
  cartId: string,
  payload: ValidateAndUpdateCustomerPayload,
): Promise<StorefrontCart> {
  await storefrontClient.cart.validateAndUpdateCustomer(locationId, cartId, payload);
  return fetchCart(locationId, cartId);
}

export async function createPaymentIntent(locationId: string, cartId: string): Promise<PaymentIntent> {
  return http.get<PaymentIntent>(`/api/v1/stripe/payment-intent`, {
    query: {
      locationId,
      cartId,
    },
  });
}

export async function applyDiscountCode(
  locationId: string,
  payload: { code: string; cartId: string },
): Promise<StorefrontCart> {
  await storefrontClient.discounts.apply(locationId, payload);
  return fetchCart(locationId, payload.cartId);
}

export async function removeDiscountCode(locationId: string, cartId: string): Promise<StorefrontCart> {
  await storefrontClient.discounts.remove(locationId, cartId);
  return fetchCart(locationId, cartId);
}

export async function addItemToCart(
  locationId: string,
  cartId: string,
  product: Product,
  quantity = 1,
  modifiers?: SelectedModifierTypes[] | undefined,
  specialInstructions?: string,
): Promise<StorefrontCart> {
  const payload: AddCartItemPayload = {
    productId: product.id,
    quantity,
    specialInstructions,
    selections: modifiers,
  };

  const response = await storefrontClient.cart.addItem(locationId, cartId, payload);
  return response.cart;
}

export async function updateCartItemQuantity(
  locationId: string,
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<StorefrontCart> {
  return storefrontClient.cart.updateItemQuantity(locationId, cartId, itemId, quantity);
}

export async function removeCartItem(locationId: string, cartId: string, itemId: string): Promise<StorefrontCart> {
  return storefrontClient.cart.updateItemQuantity(locationId, cartId, itemId, 0);
}
