"use client";

import React from "react";
import Image from "next/image";
import EbayProductsList from "@/components/products/EbayProductsList";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, CameraIcon, X } from "lucide-react";
import { convertToBase64 } from "@/utils/convertToBase64";
import { resizeImage } from "@/utils/resizeImage";
import { useProducts } from "@/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  setSelectedFile,
  setPreviewUrl,
  setDescription,
  setSearchQuery,
  setLoading,
  resetProductState,
} from "@/store/productSlice";
import CameraController from "@/components/common/CameraController";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { selectedFile, previewUrl, description, searchQuery, loading } =
    useAppSelector((s) => s.product);
  const cameraActive = useAppSelector((s) => s.ui.cameraActive);

  const { data: products, isLoading: productsLoading } =
    useProducts(searchQuery);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const optimizedFile = await resizeImage(file);
      if (optimizedFile) {
        dispatch(setSelectedFile(optimizedFile));
        dispatch(setPreviewUrl(URL.createObjectURL(optimizedFile)));
        dispatch(setDescription(null));
      }
    } else {
      dispatch(resetProductState());
    }
  };

  const handleSendRequest = async () => {
    if (!selectedFile) throw new Error("No file selected");
    try {
      dispatch(setLoading(true));
      const base64 = await convertToBase64(selectedFile);
      const desc = await axios.post("/api/describe-product", {
        imageBase64: base64,
      });
      const content = desc.data || null;
      dispatch(setDescription(content));
      const query = await axios.post("/api/get-search-query", {
        descriptionText: content,
      });
      const sq = query.data || null;
      dispatch(setSearchQuery(sq.searchQuery));
    } catch (err) {
      console.error("Error describing image:", err);
      dispatch(setDescription(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto flex flex-col items-center">
      <CameraController />
      {/* TODO: make this work with the camera simultaneouslly */}
      {/* {!selectedFile && !cameraActive && (
        <>
          <Button
            className="w-full relative relative z-100"
            variant={"default"}
          >
            <CameraIcon className="mr-2" />
            Upload a photo of your product
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="fixed opacity-0 top-[72px] left-0 w-full h-[calc(100vh-134px)] z-50 cursor-pointer"
            />
          </Button>
          <p className="text-sm text-center text-gray-500">
            For better results, try to take a picture with as much detail as
            posible.
          </p>
        </>
      )} */}

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
        <>
          <div className="w-full p-4 bg-gray-100 rounded whitespace-pre-wrap">
            <Skeleton className="w-1/3 h-4 mb-4 bg-gray-300 animate-pulse" />
            <Skeleton className="w-1/2 h-4 bg-gray-300 animate-pulse mb-3" />
            <Skeleton className="w-1/3 h-4 mb-4 bg-gray-300 animate-pulse" />
            <Skeleton className="w-1/2 h-4 bg-gray-300 animate-pulse" />
          </div>
        </>
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
        <>
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
        </>
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

export default HomePage;
