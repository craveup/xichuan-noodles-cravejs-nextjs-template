import { create } from "zustand";

interface AddressInfo {
  addressString: string;
  lat: number | null;
  lng: number | null;
}

type OrderInfoStore = {
  cartId: string;
  locationId: string;
  orderSessionError: string;
  addressInfo: AddressInfo;
  setOrderInfo: ({
    cartId,
    locationId,
  }: {
    cartId?: string;
    locationId: string;
  }) => void;
  setAddressInfo: (addressInfo: AddressInfo) => void;
  setOrderSessionError: (orderSessionError: string) => void;
};

export const useOrderInfoStore = create<OrderInfoStore>()((set) => ({
  cartId: "",
  locationId: "",
  orderSessionError: "",
  addressInfo: {
    addressString: "",
    lat: null,
    lng: null,
  },
  setOrderInfo: (newOrderInfo) =>
    set((state) => ({
      ...state,
      ...(newOrderInfo.cartId && {cartId: newOrderInfo.cartId,}),
      locationId: newOrderInfo.locationId,
    })),
  setOrderSessionError: (orderSessionError) =>
    set((state) => ({
      ...state,
      orderSessionError: orderSessionError,
    })),
  setAddressInfo: (addressInfo) =>
    set((state) => ({
      ...state,
      addressInfo,
    })),
}));
