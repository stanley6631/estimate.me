import type { EbayProductType } from "@/types/ebayProduct";
import React from "react";
import { CameraIcon } from "lucide-react";
interface EbayProductProps {
  product: EbayProductType;
}

const EbayProduct: React.FC<EbayProductProps> = ({ product }) => {
  return (
    <>
      {product.image ? (
        <div className="w-16 h-16 min-w-16 min-h-16 rounded-md overflow-hidden mr-4">
          <img
            src={product?.image?.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 min-w-16 min-h-16 border rounded-md flex items-center justify-center mr-4">
          <CameraIcon />
        </div>
      )}

      <div className="flex flex-col">
        <h3 className="text-sm font-normal font mb-1">{product.title}</h3>
        <strong className="text-md">
          {product.price.value} {product.price.currency}
        </strong>
      </div>
    </>
  );
};

export default EbayProduct;
