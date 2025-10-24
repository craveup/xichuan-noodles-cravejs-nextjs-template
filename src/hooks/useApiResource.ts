// src/hooks/useApiResource.ts
import useSWR, { SWRResponse } from "swr";
import { swrFetcher } from "@/lib/api/fetcher";
import { SWR_CONFIG } from "@/constants";
import { formatApiError } from "@/lib/format-api-error";

type UseApiResourceOptions = Partial<typeof SWR_CONFIG> & {
  shouldFetch?: boolean;
};

export function useApiResource<T = unknown>(
    endpoint: string | null,
    options: UseApiResourceOptions = {}
) {
  const { shouldFetch = true, ...swrOptions } = options;

  const key = shouldFetch && endpoint ? endpoint : null;

  const { data, error, mutate, isValidating }: SWRResponse<T> = useSWR<T>(
    key,
    swrFetcher,
    { ...SWR_CONFIG, ...swrOptions }
  );

  const errorMessage = error ? formatApiError(error).message : undefined;

  return {
    data,
    error,          // raw error
    errorMessage,   // human-readable string
    isLoading: !data && !error,
    isValidating,
    mutate,
  };
}
