export interface EbayProduct {
  itemId: string;
  title: string;
  itemGroupHref?: string;
  leafCategoryIds: string[];
  categories: Category[];
  image: Image;
  price: Price;
  itemGroupType?: string;
  itemHref: string;
  seller: Seller;
  marketingPrice?: MarketingPrice;
  condition: string;
  conditionId: string;
  thumbnailImages: Image[];
  shippingOptions: ShippingOption[];
  buyingOptions: string[];
  epid?: string;
  itemWebUrl: string;
  itemLocation: ItemLocation;
  additionalImages?: Image[];
  adultOnly: boolean;
  legacyItemId: string;
  availableCoupons: boolean;
  itemOriginDate: string;
  itemCreationDate: string;
  itemEndDate?: string;
  topRatedBuyingExperience: boolean;
  priorityListing: boolean;
  listingMarketplaceId: string;
  bidCount?: number;
  currentBidPrice?: Price;
  pickupOptions?: PickupOption[];
}

interface Category {
  categoryId: string;
  categoryName: string;
}

interface Image {
  imageUrl: string;
}

interface Price {
  value: string;
  currency: string;
}

interface Seller {
  username: string;
  feedbackPercentage: string;
  feedbackScore: number;
}

interface MarketingPrice {
  originalPrice: Price;
  discountPercentage: string;
  discountAmount: Price;
  priceTreatment?: string;
}

interface ShippingOption {
  shippingCostType: string;
  shippingCost?: Price;
  minEstimatedDeliveryDate?: string;
  maxEstimatedDeliveryDate?: string;
}

interface ItemLocation {
  postalCode?: string;
  country: string;
}

interface PickupOption {
  pickupLocationType: string;
}
