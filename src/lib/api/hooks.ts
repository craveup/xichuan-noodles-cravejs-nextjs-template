import useMenus from "@/hooks/useMenus";
import { useApiResource } from "@/hooks/useApiResource";
import type { MenuResponse, Product } from "@/lib/api/types";
import { ORGANIZATION_SLUG } from "@/constants";

const canFetchForLocation = (locationId: string | undefined | null) => {
  if (!locationId) return false;
  if (ORGANIZATION_SLUG && locationId === ORGANIZATION_SLUG) {
    return false;
  }
  return true;
};

export const useMenuItems = (locationId: string) => {
  const enabled = canFetchForLocation(locationId);

  const response = useMenus({
    locationId,
    isEnabled: enabled,
  });

  return {
    data: response.data as MenuResponse | undefined,
    error: response.error,
    isLoading: response.isLoading,
    isFetching: response.isValidating,
  };
};

export const useProducts = (locationId: string, cartId?: string | null) => {
  const enabled = canFetchForLocation(locationId) && Boolean(cartId);

  const response = useApiResource<Product[]>(
    enabled && locationId && cartId
      ? `/api/v1/locations/${locationId}/carts/${cartId}/products`
      : null,
    { shouldFetch: enabled && Boolean(locationId && cartId) },
  );

  return {
    data: response.data,
    error: response.error,
    isLoading: response.isLoading,
    isFetching: response.isValidating,
  };
};
