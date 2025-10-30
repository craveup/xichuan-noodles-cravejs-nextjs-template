import type {
  AddCartItemPayload,
  AddCartItemResponse,
  CartCustomer,
  CartItem,
  CartModifierGroup,
  CartModifierItem,
  CreatePaymentIntentResponse,
  DeliveryInfo,
  GetLocationViaSlugType,
  MerchantLocation,
  MerchantApiResponse,
  Menu,
  Modifier,
  ModifierChildLink,
  ModifierItem,
  OrderTimesResponse,
  Product,
  ProductDescription,
  RequestConfig,
  StorefrontCart,
  UpdateGratuityPayload,
  UpdateOrderTimePayload,
  ValidateAndUpdateCustomerPayload,
  VerifyDiscountPayload,
  WaiterTipConfigResponse,
  SelectedModifierTypes,
  SelectedModifierOption,
  LocationAddressDTO,
} from "@craveup/storefront-sdk";

export type Cart = StorefrontCart;
export type MenuResponse = { menus: Menu[]; popularProducts?: Product[] };
export type TimeInterval = OrderTimesResponse["orderDays"][number];
export type GratuitySettings = WaiterTipConfigResponse;
export type PaymentIntent = CreatePaymentIntentResponse;

export type {
  CartCustomer,
  CartItem,
  CartModifierGroup,
  CartModifierItem,
  DeliveryInfo,
  Modifier,
  ModifierChildLink,
  ModifierItem,
  Product,
  ProductDescription,
  MerchantApiResponse,
};
export type {
  AddCartItemPayload,
  AddCartItemResponse,
  GetLocationViaSlugType,
  MerchantLocation,
  LocationAddressDTO,
  RequestConfig,
  StorefrontCart,
  SelectedModifierOption,
  SelectedModifierTypes,
  UpdateGratuityPayload,
  UpdateOrderTimePayload,
  ValidateAndUpdateCustomerPayload,
  VerifyDiscountPayload,
  WaiterTipConfigResponse,
};
