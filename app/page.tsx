"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, CameraIcon } from "lucide-react";
import { convertToBase64 } from "@/utils/convertToBase64";
import { resizeImage } from "@/utils/resizeImage";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      const content = res.data || "No description returned.";
      setDescription(content);
    } catch (err) {
      console.error("Error describing image:", err);
      setDescription("Error: Failed to describe the image.");
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
            alt="You'r buddy estimator"
          ></Image>
          <Button className="w-full relative" variant={"default"}>
            <CameraIcon className="mr-2" />
            Take or upload a photo
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
            />
          </Button>
          <p className="text-sm text-center text-gray-500">
            For better results, try to take a picture of your product with as
            much detail as posiible.
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
        <>
          <div className="bg-gray-100 p-4 rounded mt-4 whitespace-pre-wrap">
            <strong>Product:</strong>
            <p>{description}</p>
          </div>
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
        </>
      )}
    </div>
  );
};

export default HomePage;
