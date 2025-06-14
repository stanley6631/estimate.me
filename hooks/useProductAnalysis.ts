import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProductAnalysisDataObject } from "@/types/ebayProduct";

export const useProductAnalysis = (data: ProductAnalysisDataObject[]) => {
  return useQuery({
    queryKey: ["productAnalysis", data],
    queryFn: async () => {
      const response = await axios.post("/api/product-analysis", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("There was an error analyzing the product data");
      }

      return response.data;
    },
    enabled: !!data?.length,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
