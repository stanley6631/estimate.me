import { useQuery } from "@tanstack/react-query";
import { EbaySearchResponse } from "@/types/ebayResponse";
import { getMatchingProductsAction } from "@/actions/actions";

export const useProducts = (searchQuery: string | null) => {
  return useQuery({
    queryKey: ["ebayProducts", searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        throw new Error("Search query is required to fetch products");
      }

      console.log("Fetching products for query:", searchQuery);

      const result = await getMatchingProductsAction(searchQuery);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch products");
      }

      return result.data as EbaySearchResponse;
    },
    enabled: !!searchQuery,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
