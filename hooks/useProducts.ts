import { useQuery } from "@tanstack/react-query";
import { EbaySearchResponse } from "@/types/ebayResponse";
import { GptProductObjectResponse } from "@/types/gptProductObjectResponse";

export const useProducts = (query: GptProductObjectResponse) => {
  return useQuery({
    queryKey: ["ebayProducts", query],
    queryFn: async () => {
      const response = await fetch(
        `/api/get-matching-products?q=${encodeURIComponent(query.product_name)}`
      );
      if (!response.ok) {
        throw new Error(
          "There was an error fetching matching the products from the API"
        );
      }
      return response.json() as Promise<EbaySearchResponse>;
    },
    enabled: !!query,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
