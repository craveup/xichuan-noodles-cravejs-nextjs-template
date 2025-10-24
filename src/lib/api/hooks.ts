import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems, fetchProducts } from "./client";

export const useMenuItems = (
  locationId: string,
  orderDate?: string,
  orderTime?: string,
) => {
  const menuOnly = !(orderDate && orderTime);

  return useQuery({
    queryKey: ["menu", locationId, orderDate, orderTime, menuOnly],
    queryFn: () =>
      fetchMenuItems(locationId, orderDate, orderTime, { menuOnly }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(locationId),
  });
};

export const useProducts = (locationId: string) =>
  useQuery({
    queryKey: ["products", locationId],
    queryFn: () => fetchProducts(locationId),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(locationId),
  });
