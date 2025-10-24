"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type QueryClientProviderProps = {
  children: ReactNode;
};

/**
 * Provides a single QueryClient instance to the app so that all hooks under
 * `@tanstack/react-query` share cache/state without triggering hydration issues.
 */
export function XichuanQueryClientProvider({ children }: QueryClientProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
