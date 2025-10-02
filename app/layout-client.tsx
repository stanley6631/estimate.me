"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

const queryClient = new QueryClient();

interface ClientProviderProps {
  children: ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

export default ClientProvider;
