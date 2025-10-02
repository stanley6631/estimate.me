import React, { useRef } from "react";
import { CameraIcon } from "lucide-react";
import { Button } from "../ui/button";
import { resizeImage } from "@/utils/resizeImage";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setCameraActive } from "@/store/uiSlice";
import {
  setSelectedFile,
  setPreviewUrl,
  setDescription,
} from "@/store/productSlice";

const CameraController: React.FC = () => {
  const dispatch = useAppDispatch();
  const cameraActive = useAppSelector((s) => s.ui.cameraActive);
  const selectedFile = useAppSelector((s) => s.product.selectedFile);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    dispatch(setCameraActive(true));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      dispatch(setCameraActive(false));
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
              dispatch(setSelectedFile(optimizedFile));
              dispatch(setPreviewUrl(URL.createObjectURL(optimizedFile)));
              dispatch(setDescription(null));
              dispatch(setCameraActive(false));
            }
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <>
      {!cameraActive && !selectedFile && (
        <Button
          className="w-full relative"
          variant={"default"}
          onClick={startCamera}
        >
          <CameraIcon className="mr-2" />
          Open Camera
        </Button>
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
    </>
  );
};

export default CameraController;
