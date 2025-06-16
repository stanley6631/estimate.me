import type { EbayProductType } from "@/types/ebayProduct";
import type { ProductAnalysisDataObject } from "@/types/ebayProduct";

/**
 * Convert EbayProduct data to ProductAnalysisDataObject format to reduce the size of the data sent to the backend for analysis
 */
export function convertToAnalysisData(
  data: EbayProductType[]
): ProductAnalysisDataObject[] {
  return data.map((item) => ({
    title: item.title,
    price: item.price,
    condition: item.condition,
  }));
}
