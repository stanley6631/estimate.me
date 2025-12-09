"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, X } from "lucide-react";
import { convertToBase64 } from "@/utils/convertToBase64";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  setDescription,
  setSearchQuery,
  setLoading,
  resetProductState,
} from "@/store/productSlice";
import CameraController from "@/components/common/CameraController";
import EbayProductsList from "@/components/products/EbayProductsList";
import { describeProductAction, getSearchQueryAction } from "@/actions/actions";
import { useProducts } from "@/hooks/useProducts";

const ProductAnalyzer = () => {
  const dispatch = useAppDispatch();
  const { selectedFile, previewUrl, description, searchQuery, loading } =
    useAppSelector((s) => s.product);

  const { data: products, isLoading: productsLoading } =
    useProducts(searchQuery);

  const handleSendRequest = async () => {
    if (!selectedFile) throw new Error("No file selected");
    try {
      dispatch(setLoading(true));
      const base64 = await convertToBase64(selectedFile);

      // Call Server Action for description
      const descResult = await describeProductAction(base64);
      if (!descResult.success || !descResult.data) {
        throw new Error("Failed to describe product");
      }

      const content = descResult.data;
      dispatch(setDescription(content));

      // Call Server Action for search query
      const queryResult = await getSearchQueryAction(content);
      if (!queryResult.success || !queryResult.data) {
        throw new Error("Failed to generate search query");
      }

      dispatch(setSearchQuery(queryResult.data.searchQuery));
    } catch (err) {
      console.error("Error analyzing image:", err);
      dispatch(setDescription(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto flex flex-col items-center">
      <CameraController />

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          width={300}
          height={300}
          className="rounded w-full h-auto mb-4"
        />
      )}

      {loading && (
        <div className="w-full p-4 bg-gray-100 rounded whitespace-pre-wrap">
          <Skeleton className="w-1/3 h-4 mb-4 bg-gray-300 animate-pulse" />
          <Skeleton className="w-1/2 h-4 bg-gray-300 animate-pulse mb-3" />
          <Skeleton className="w-1/3 h-4 mb-4 bg-gray-300 animate-pulse" />
          <Skeleton className="w-1/2 h-4 bg-gray-300 animate-pulse" />
        </div>
      )}

      {description && (
        <>
          <div className="w-full bg-gray-100 p-4 rounded whitespace-pre-wrap mb-4">
            <strong>Product:</strong>
            <p className="mb-3">{description}</p>
          </div>

          <EbayProductsList
            products={products?.itemSummaries}
            productsLoading={productsLoading}
          />
        </>
      )}

      {selectedFile && !description && (
        <div className="grid grid-cols-12 w-full gap-4">
          <div className="col-span-6">
            <Button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full"
            >
              <CheckIcon />
              Analyze product
            </Button>
          </div>
          <div className="col-span-6">
            <Button
              onClick={() => {
                dispatch(resetProductState());
              }}
              disabled={loading}
              className="w-full"
              variant={"outline"}
            >
              <X />
              Retake picture
            </Button>
          </div>
        </div>
      )}

      {description && (
        <Button
          className="w-full"
          variant={"default"}
          onClick={() => {
            dispatch(resetProductState());
            dispatch(setLoading(false));
          }}
        >
          Analyze another product
        </Button>
      )}
    </div>
  );
};

export default ProductAnalyzer;
