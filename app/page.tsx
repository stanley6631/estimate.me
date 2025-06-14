"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import EbayProductsList from "@/components/products/EbayProductsList";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon, CameraIcon } from "lucide-react";
import { convertToBase64 } from "@/utils/convertToBase64";
import { resizeImage } from "@/utils/resizeImage";
import { useProducts } from "@/hooks/useProducts";
import type { GptProductObjectResponse } from "@/types/gptProductObjectResponse";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] =
    useState<GptProductObjectResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: products, isLoading: productsLoading } =
    useProducts(description);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const optimizedFile = await resizeImage(file);

      if (optimizedFile) {
        setSelectedFile(optimizedFile);
        setPreviewUrl(URL.createObjectURL(optimizedFile));
        setDescription(null); // Reset previous result
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    try {
      setLoading(true);
      const base64 = await convertToBase64(selectedFile);

      const res = await axios.post("/api/describe-product", {
        imageBase64: base64,
      });

      const content = res.data || null;
      const cleaned = content.replace(/```json|```/g, "").trim();
      setDescription(JSON.parse(cleaned));
    } catch (err) {
      console.error("Error describing image:", err);
      setDescription(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto flex flex-col items-center">
      {!selectedFile && (
        <>
          <Image
            src={"/robot/default.png"}
            height={200}
            width={200}
            alt="Your buddy estimator"
          ></Image>
          <Button className="w-full relative" variant={"default"}>
            <CameraIcon className="mr-2" />
            Take or upload a photo of your product
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="fixed opacity-0 top-[72px] left-0 w-full h-[calc(100vh-134px)] cursor-pointer"
            />
          </Button>
          <p className="text-sm text-center text-gray-500">
            For better results, try to take a picture with as much detail as
            posiible.
          </p>
        </>
      )}

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
            <p className="mb-3">{description.product_name}</p>
            <strong>Condition:</strong>
            <p>{description.condition}</p>
          </div>

          {productsLoading ? (
            <Skeleton className="w-full h-4 bg-gray-300 animate-pulse" />
          ) : (
            products &&
            products.itemSummaries.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">
                  Best matching products:
                </h3>
                <EbayProductsList products={products.itemSummaries} />
              </div>
            )
          )}
        </>
      )}

      {selectedFile && !description && (
        <Button
          onClick={handleSendRequest}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Estimate Product"
          )}
        </Button>
      )}

      {description && (
        <Button
          className="w-full"
          variant={"default"}
          onClick={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
            setDescription(null);
            setLoading(false);
          }}
        >
          Choose another product
        </Button>
      )}
    </div>
  );
};

export default HomePage;
