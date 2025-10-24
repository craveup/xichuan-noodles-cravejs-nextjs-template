import type {
  AddCartItemPayload,
  AddCartItemResponse,
  LocationAddressDTO,
  UpdateGratuityPayload,
  UpdateOrderTimePayload,
  ValidateAndUpdateCustomerPayload,
  StorefrontCart,
  RequestConfig
} from '@craveup/storefront-sdk';
import { storefrontClient } from '@/lib/storefront-client';

export function getCart(
  locationId: string,
  cartId: string,
  config?: RequestConfig
): Promise<StorefrontCart> {
  return storefrontClient.cart.get(locationId, cartId, config);
}

export function updateOrderTime(
  locationId: string,
  cartId: string,
  payload: UpdateOrderTimePayload,
  config?: RequestConfig
): Promise<StorefrontCart | { success: true }> {
  return storefrontClient.cart.updateOrderTime(locationId, cartId, payload, config);
}

export function validateAndUpdateCustomer(
  locationId: string,
  cartId: string,
  payload: ValidateAndUpdateCustomerPayload,
  config?: RequestConfig
): Promise<{ success: true }> {
  return storefrontClient.cart.validateAndUpdateCustomer(locationId, cartId, payload, config);
}

export function updateGratuity(
  locationId: string,
  cartId: string,
  payload: UpdateGratuityPayload,
  config?: RequestConfig
): Promise<StorefrontCart> {
  return storefrontClient.cart.updateGratuity(locationId, cartId, payload, config);
}

export function setDelivery(
  locationId: string,
  cartId: string,
  payload: LocationAddressDTO,
  config?: RequestConfig
): Promise<{ success: true }> {
  return storefrontClient.cart.setDelivery(locationId, cartId, payload, config);
}

export function setTable(
  locationId: string,
  cartId: string,
  tableNumber: string,
  config?: RequestConfig
): Promise<{ success: true }> {
  return storefrontClient.cart.setTable(locationId, cartId, tableNumber, config);
}

export function setRoom(
  locationId: string,
  cartId: string,
  payload: { lastName: string; roomNumber: string },
  config?: RequestConfig
): Promise<{ success: true }> {
  return storefrontClient.cart.setRoom(locationId, cartId, payload, config);
}

export function addCartItem(
  locationId: string,
  cartId: string,
  payload: AddCartItemPayload,
  config?: RequestConfig
): Promise<AddCartItemResponse> {
  return storefrontClient.cart.addItem(locationId, cartId, payload, config);
}

export function updateCartItemQuantity(
  locationId: string,
  cartId: string,
  itemId: string,
  quantity: number,
  config?: RequestConfig
): Promise<StorefrontCart> {
  return storefrontClient.cart.updateItemQuantity(locationId, cartId, itemId, quantity, config);
}

export function deleteCart(
  locationId: string,
  cartId: string,
  config?: RequestConfig
): Promise<{ success: true }> {
  return storefrontClient.cart.delete(locationId, cartId, config);
}
