import { useCart } from "@/hooks/useCart";
import { useApiResource } from "@/hooks/useApiResource";
import { BundleMenu } from "@/types/menus";
import { Product } from "@/types";
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";

export type MenusResponse = {
  menus: BundleMenu[];
  popularProducts: Product[];
};

const useMenus = () => {
  const { orderSessionError } = useOrderInfoStore();
  const { cart } = useCart();
  const {locationId} = useOrderInfoStore();

  const hasCartTiming =
    Boolean(cart?.locationId) && Boolean(cart?.orderDate) && Boolean(cart?.orderTime);

  let endpoint: string | null = null;

  if (locationId) {
    if (hasCartTiming) {
      endpoint = `/api/v1/locations/${locationId}/menus?orderDate=${encodeURIComponent(
        cart!.orderDate,
      )}&orderTime=${encodeURIComponent(cart!.orderTime)}`;
    } else if (orderSessionError) {
      endpoint = `/api/v1/locations/${locationId}/menus?menuOnly=true`;
    }
  }

  const shouldFetch = Boolean(endpoint);

  return useApiResource<MenusResponse>(endpoint, { shouldFetch });
};

export default useMenus;
