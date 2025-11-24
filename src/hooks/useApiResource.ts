import useSWR, { SWRResponse } from "swr";
import { SWR_CONFIG } from "@/constants";
import { swrFetcher } from "@/lib/api/fetcher";
import { toErrorMessage } from "@/lib/api/error-utils";

type UseApiResourceOptions = Partial<typeof SWR_CONFIG> & {
  shouldFetch?: boolean;
};

export function useApiResource<T = unknown>(
  endpoint: string | null,
  options: UseApiResourceOptions = {},
) {
  const { shouldFetch = true, ...swrOptions } = options;
  const key = shouldFetch && endpoint ? endpoint : null;

  const { data, error, mutate, isValidating }: SWRResponse<T> = useSWR<T>(
    key,
    swrFetcher,
    { ...SWR_CONFIG, ...swrOptions },
  );

  const errorMessage = error ? toErrorMessage(error) : undefined;

  return {
    data,
    error,
    errorMessage,
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
}
