import type { EbayProduct } from "@/types/ebayProduct";
import React from "react";

interface EbayProductProps {
  product: EbayProduct;
}

const EbayProduct: React.FC<EbayProductProps> = ({ product }) => {
  return (
    <div className="mb-2">
      <h2>{product.title}</h2>
    </div>
  );
};

export default EbayProduct;
