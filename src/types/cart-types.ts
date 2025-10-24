import type {
  CartModifierItem,
  CartModifierGroup,
  CartItem,
  CartCustomer,
  CartFees,
  DeliveryInfo,
  RoomServiceInfo,
  TableServiceInfo,
  StorefrontCart as BaseStorefrontCart
} from "@craveup/storefront-sdk";

/**
 * Extends the SDK cart definition with hosted checkout URLs so the template can
 * redirect customers to the CraveUp checkout experience when requested.
 */
export type StorefrontCart = BaseStorefrontCart & {
  checkoutUrl?: string | null;
  cartUrl?: string | null;
};

export type {
  CartModifierItem,
  CartModifierGroup,
  CartItem,
  CartCustomer,
  CartFees,
  DeliveryInfo,
  RoomServiceInfo,
  TableServiceInfo
};
