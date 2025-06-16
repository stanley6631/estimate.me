import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { EbayProductType } from "@/types/ebayProduct";
import { useProductAnalysis } from "@/hooks/useProductAnalysis";
import { convertToAnalysisData } from "@/utils/convertToAnalysisData";
import { Button } from "@/components/ui/button";
import EbayProduct from "@/components/products/EbayProduct";

interface EbayProductsListProps {
  products: EbayProductType[] | undefined;
  productsLoading: boolean;
}

const EbayProductsList: React.FC<EbayProductsListProps> = ({
  products,
  productsLoading,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const { data: productAnalysis, isLoading: productAnalysisLoading } =
    useProductAnalysis(convertToAnalysisData(products ? products : []));

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 5, 100));
  };

  return (
    <div className="w-full">
      <span className="font-medium text-md flex items-center mb-2">
        <span className="me-1">Best matching products on</span>
        <Image src={"/ebay.svg"} width={60} height={20} alt=""></Image>
      </span>
      {productsLoading ? (
        <ul className="mb-2 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              className="flex items-center mb-4 p-2 border-b w-full"
              key={`skeleton-${index}`}
            >
              <Skeleton className="w-16 h-16 min-w-16 min-h-16 rounded-md mr-4 bg-gray-300 animate-pulse" />
              <div className="w-full flex flex-col">
                <Skeleton className="h-4 w-full mb-1 bg-gray-300 animate-pulse" />
                <Skeleton className="h-4 w-20 bg-gray-300 animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {products && (
            <>
              <ul className="mb-2 w-full">
                {products.slice(0, visibleCount).map((product, index) => (
                  <li
                    className={`flex items-center mb-4 p-2 ${
                      index === products.slice(0, visibleCount).length - 1
                        ? ""
                        : "border-b"
                    }`}
                    key={product.itemId}
                  >
                    <EbayProduct product={product} />
                  </li>
                ))}
              </ul>

              {(visibleCount < 100 || visibleCount > products.length) && (
                <Button
                  onClick={handleLoadMore}
                  variant={"link"}
                  className="w-full mb-2"
                >
                  Load More
                </Button>
              )}
            </>
          )}
        </>
      )}

      {productAnalysis &&
        !productAnalysisLoading &&
        console.log(productAnalysis)}
    </div>
  );
};

export default EbayProductsList;
