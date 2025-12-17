import { useQuery } from "@tanstack/react-query";
import { ProductAnalysisDataObject } from "@/types/ebayProduct";
import { analyzeProductsAction } from "@/actions/actions";

export const useProductAnalysis = (data: ProductAnalysisDataObject[]) => {
  return useQuery({
    queryKey: ["productAnalysis", data],
    queryFn: async () => {
      const result = await analyzeProductsAction(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to analyze products");
      }

      return result.data;
    },
    enabled: !!data?.length,
  });
};
