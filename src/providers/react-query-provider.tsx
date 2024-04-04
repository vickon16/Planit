"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions : {
    queries : {
      staleTime : 30 * 60 * 1000, // 30 mins
      gcTime : 60 * 60 * 1000, // 60 mins
      refetchOnWindowFocus : false,
    }
  }
});

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
