import React, { useState } from "react";
import { EbayProduct } from "@/types/ebayProduct";
import { useProductAnalysis } from "@/hooks/useProductAnalysis";
import { convertToAnalysisData } from "@/utils/convertToAnalysisData";
import Image from "next/image";
import { Button } from "@/components/ui/button";
interface EbayProductsListProps {
  products: EbayProduct[];
}

const EbayProductsList: React.FC<EbayProductsListProps> = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const { data: productAnalysis, isLoading: productAnalysisLoading } =
    useProductAnalysis(convertToAnalysisData(products));

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 5, 100));
  };

  return (
    <div>
      <span className="font-medium text-md flex items-center mb-2">
        <span className="me-1">Best matching products on</span>
        <Image src={"/ebay.svg"} width={60} height={20} alt=""></Image>
      </span>
      <ul className="mb-2">
        {products.slice(0, visibleCount).map((product, index) => (
          <li
            className={`flex items-center mb-4 p-2 ${
              index === products.slice(0, visibleCount).length - 1
                ? ""
                : "border-b"
            }`}
            key={product.itemId}
          >
            <img
              src={product.image.imageUrl}
              alt={product.title}
              className="w-16 h-16 object-cover mr-4"
            />
            <div className="flex flex-col">
              <h3 className="text-sm font-normal font mb-1">{product.title}</h3>
              <strong className="text-md">
                {product.price.value} {product.price.currency}
              </strong>
            </div>
          </li>
        ))}
      </ul>

      {visibleCount < 100 && (
        <Button
          onClick={handleLoadMore}
          variant={"link"}
          className="w-full mb-2"
        >
          Load More
        </Button>
      )}

      {productAnalysis &&
        !productAnalysisLoading &&
        console.log(productAnalysis)}
    </div>
  );
};

export default EbayProductsList;
