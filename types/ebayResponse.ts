import type { EbayProductType } from "./ebayProduct";

export interface EbaySearchResponse {
  href: string;
  total: number;
  next?: string;
  limit: number;
  offset: number;
  itemSummaries: EbayProductType[];
}
