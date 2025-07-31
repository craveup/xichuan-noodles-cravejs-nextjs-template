// ✅ **Modifier Item in the Cart**
export interface CartModifierItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

// ✅ **Modifier Group in the Cart**
export interface CartModifierGroup {
  id: string;
  name: string;
  isFixed: boolean;
  required: boolean;
  quantity: number;
  items: CartModifierItem[];
}

// ✅ **Single Cart Item**
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  quantity: number;
  total: string;
  discount: string;
  categoryId: string | null;
  specialInstructions?: string;
  itemUnavailableAction: string;
  selectedModifiers: CartModifierGroup[];
}

// ✅ **Customer Information in Cart**
export interface CartCustomer {
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  customerId?: string;
}

// ✅ **Fees Structure in Cart**
export interface CartFees {
  enterpriseFeeRate: string;
  enterpriseFeeFix: string;
  serviceFeeRate: string;
  serviceFeeFix: string;
  taxRate: string;
  tipRate: string;
  deliveryFeeFix: string;
  deliveryFeeRate: string;
  fulfillmentMethodFeeFix: string;
  fulfillmentMethodFeeRate: string;
}

// ✅ **Delivery Information**
export interface DeliveryInfo {
  deliveryAddress?: string;
  lat?: number;
  lng?: number;
}

// ✅ **Room Service Information**
export interface RoomServiceInfo {
  lastName?: string;
  roomNumber?: string;
}

// ✅ **Table Service Information**
export interface TableServiceInfo {
  tableNumber?: string;
}

// ✅ **Main Cart Type**
export interface CartResponse {
  id: string;
  timezone: string;
  restaurantDisplayName: string;
  fulfillmentMethod: string;
  fulfillmentIdentifier?: string;
  deliveryInfo?: DeliveryInfo;
  roomServiceInfo?: RoomServiceInfo;
  tableServiceInfo?: TableServiceInfo;
  pickupType: string;
  orderTime: string;
  orderDate: string;
  locationId: string;
  discountCode?: string;
  checkoutUrl: string;
  cartUrl: string;
  totalQuantity: number;
  note?: string;
  currency: string;
  country: string;
  statementDescriptor: string;
  subTotal: string;
  taxTotal: string;
  orderTotal: string;
  discountTotal: string;
  orderTotalWithServiceFee: string;
  waiterTipTotal: string;
  serviceFeeTotal: string;
  deliveryFeeTotal: string;
  enterpriseFeeTotal: string;
  subTotalWithoutDiscount: string;
  taxAndFeeTotal: string;
  fees: CartFees;
  customer?: CartCustomer;
  items: CartItem[];
}

// ✅ **Location Data**
export interface LocationData {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  phone?: string;
  email?: string;
  website?: string;
}

// ✅ **Product Data**
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  modifierGroups?: any[];
}

// ✅ **Checkout Data**
export interface CheckoutData {
  cartId: string;
  locationId: string;
  customer: CartCustomer;
  paymentMethod: string;
  fulfillmentMethod: string;
  orderTime: string;
  orderDate: string;
  note?: string;
  tipAmount?: string;
  promoCode?: string;
}

// ✅ **Payment Intent Response**
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

// ✅ **Product from API**
export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: string | number;
  images?: string[];
  category?: string;
  availability?: string;
  modifierGroups?: any[];
}

// ✅ **Legacy type aliases for backwards compatibility**
export type Location = LocationData;
export type Cart = CartResponse;
export type MenuResponse = any;
export type TimeInterval = any;
export type GratuitySettings = any;
export type PaymentIntent = PaymentIntentResponse;
export type DiscountCode = any;