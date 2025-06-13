import type { EbayProduct } from "./ebayProduct";

export interface EbaySearchResponse {
  href: string;
  total: number;
  next?: string;
  limit: number;
  offset: number;
  itemSummaries: EbayProduct[];
}
