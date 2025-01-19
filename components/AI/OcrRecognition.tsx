// Example frontend code (Next.js component)

"use client";

import { useState } from "react";
import LoaderSpinner from "../ui/LoaderSpinner";
import Upload from "../icons/Upload";
import Image from "next/image";
import Magic from "../icons/Magic";

interface Props {
  ocrResult: string;
  setOcrResult: (result: string) => void;
}
export default function OcrRecognition({ ocrResult, setOcrResult }: Props) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setOcrResult("");
      // Use FileReader to read and display the image
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setOcrResult(data.result || "No text found.");
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-fit min-w-[240px] flex flex-col items-center gap-2 p-2 rounded-2xl bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10">
        <span>
          <h2 className="text-2xl text-center font-bold leading-tight">
            Image to text
          </h2>
          {ocrResult !== "" && ocrResult !== "No text found." && (
            <p className="text-[10px]">
              Don't worry much about misspelled, or missed words
            </p>
          )}
        </span>

        <div className=" flex justify-center relative">
          <span className="text-7xl">
            <div className="border-dashed border-2 bg-white bg-opacity-5  text-slate-300 rounded-xl p-1 px-6 border-slate-500">
              <Upload />
            </div>
          </span>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className=" w-full h-full cursor-pointer absolute top-0 opacity-0"
          />
        </div>
        <span
          className={`flex flex-col justify-center items-center gap-2 ${
            imageUrl !== "" && !ocrResult && "pb-12"
          } relative`}
        >
          {imageUrl && (
            <Image width={280} height={100} src={imageUrl} alt={imageUrl} />
          )}
          {imageUrl !== "" && !ocrResult && (
            <button
              disabled={loading}
              style={{ cursor: `${loading ? "default" : "pointer"}` }}
              className={`btn btn-ghost btn-round text-2xl absolute bottom-0 -right-0`}
              onClick={handleUpload}
            >
              {loading ? <LoaderSpinner /> : <Magic />}
            </button>
          )}
          {ocrResult === "No text found." && (
            <button
              disabled={loading}
              style={{ cursor: `${loading ? "default" : "pointer"}` }}
              className={`btn btn-ghost btn-round text-2xl absolute bottom-0 -right-0`}
              onClick={handleUpload}
            >
              {loading ? <LoaderSpinner /> : <Magic />}
            </button>
          )}
          {ocrResult && <p className="text-sm text-gray-200 ">{ocrResult}</p>}
        </span>
      </div>
    </div>
  );
}
