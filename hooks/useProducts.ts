import { useQuery } from "@tanstack/react-query";
import { EbaySearchResponse } from "@/types/ebayResponse";

export const useProducts = (searchQuery: string | null) => {
  return useQuery({
    queryKey: ["ebayProducts", searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        throw new Error("Search query is required to fetch products");
      }

      console.log("Fetching products for query:", searchQuery);

      const response = await fetch(
        `/api/get-matching-products?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error(
          "There was an error fetching matching the products from the API"
        );
      }
      return response.json() as Promise<EbaySearchResponse>;
    },
    enabled: !!searchQuery,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
