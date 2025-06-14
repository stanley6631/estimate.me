import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProductAnalysisDataObject } from "@/types/ebayProduct";

export const useProductAnalysis = (data: ProductAnalysisDataObject[]) => {
  return useQuery({
    queryKey: ["productAnalysis", data],
    queryFn: async () => {
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const file = new File([jsonBlob], "product-data.json", {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/product-analysis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
