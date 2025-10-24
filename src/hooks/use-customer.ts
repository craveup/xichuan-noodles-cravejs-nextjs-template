import { formatApiError } from "@/lib/format-api-error";
import { useApiResource } from "@/hooks/useApiResource";

export type CustomerAddress = {
  addressId?: string;
  fullAddress?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  lat?: number;
  lng?: number;
};

export type CustomerResponse = {
  id: string;
  customerName: string;
  lastName: string;
  customerEmail?: string;
  phoneNumber?: string;
  profilePicture?: string;
};

const useCustomer = () => {
  const { data, error, mutate, isValidating } = useApiResource<CustomerResponse>(`/api/v1/customer`);

  const userData = data?.id ? data : undefined;

  return {
    data: userData,
    error: error ? formatApiError(error).message : undefined,
    isLoading: !data && !error && isValidating,
    isAuthenticated: Boolean(userData),
    mutate,
  };
};

export default useCustomer;
