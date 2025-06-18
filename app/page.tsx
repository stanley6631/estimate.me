"use client";

import React, { useState, useRef } from "react";
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

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: products, isLoading: productsLoading } =
    useProducts(searchQuery);

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

      const desc = await axios.post("/api/describe-product", {
        imageBase64: base64,
      });

      const content = desc.data || null;
      setDescription(content);

      const query = await axios.post("/api/get-search-query", {
        descriptionText: content,
      });
      const searchQuery = query.data || null;
      setSearchQuery(searchQuery.searchQuery);
    } catch (err) {
      console.error("Error describing image:", err);
      setDescription(null);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");

      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", {
              type: "image/jpeg",
            });
            const optimizedFile = await resizeImage(file);
            if (optimizedFile) {
              setSelectedFile(optimizedFile);
              setPreviewUrl(URL.createObjectURL(optimizedFile));
              setDescription(null);
              setCameraActive(false);
            }
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto flex flex-col items-center">
      {!selectedFile && !cameraActive && (
        <>
          {/* <Button
            className="w-full relative"
            variant={"default"}
            onClick={startCamera}
          >
            <CameraIcon className="mr-2" />
            Open Camera
          </Button> */}
          <Button
            className="w-full relative relative z-100"
            variant={"default"}
          >
            <CameraIcon className="mr-2" />
            Take or upload a photo of your product
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
      )}

      {cameraActive && (
        <>
          <video ref={videoRef} className="w-full h-auto rounded mb-4" />
          <canvas
            ref={canvasRef}
            className="hidden"
            width={300}
            height={300}
          ></canvas>
          <Button className="w-full" onClick={captureImage}>
            Capture Image
          </Button>
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
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setDescription(null);
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
            setSelectedFile(null);
            setPreviewUrl(null);
            setDescription(null);
            setLoading(false);
          }}
        >
          Analyze another product
        </Button>
      )}
    </div>
  );
};

export default HomePage;
