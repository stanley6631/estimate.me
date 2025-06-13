import React from "react";
import { EbayProduct } from "@/types/ebayProduct";

interface EbayProductsListProps {
  products: EbayProduct[];
}

const EbayProductsList: React.FC<EbayProductsListProps> = ({ products }) => {
  return (
    <div>
      <ul>
        {products.map((product) => (
          <li className="mb-1" key={product.itemId}>
            {product.title} -
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EbayProductsList;
