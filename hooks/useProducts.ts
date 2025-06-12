import { useQuery } from "@tanstack/react-query";

export const useProducts = (query: string) => {
  return useQuery({
    queryKey: ["ebayProducts", query],
    queryFn: async () => {
      const response = await fetch(
        `/api/get-matching-products?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(
          "There was an error fetching matching the products from the API"
        );
      }
      return response.json();
    },
    enabled: !!query,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
