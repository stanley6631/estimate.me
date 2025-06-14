import React from "react";
import { EbayProduct } from "@/types/ebayProduct";
import { useProductAnalysis } from "@/hooks/useProductAnalysis";
import { convertToAnalysisData } from "@/utils/convertToAnalysisData";

interface EbayProductsListProps {
  products: EbayProduct[];
}

const EbayProductsList: React.FC<EbayProductsListProps> = ({ products }) => {
  const { data: productAnalysis, isLoading: productAnalysisLoading } =
    useProductAnalysis(convertToAnalysisData(products));

  return (
    <div>
      <ul className="mb-2">
        {products.slice(0, 5).map((product) => (
          <li className="mb-1" key={product.itemId}>
            {product.title} -
          </li>
        ))}
      </ul>

      {productAnalysis &&
        !productAnalysisLoading &&
        console.log(productAnalysis)}
    </div>
  );
};

export default EbayProductsList;
