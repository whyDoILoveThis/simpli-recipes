"use client";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useRef, useState } from "react";

const ObjectDetection = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const img = URL.createObjectURL(event.target.files[0]);
      if (imgRef.current) {
        imgRef.current.src = img;
        const model = await cocoSsd.load();
        const predictions = await model.detect(imgRef.current);

        setResults(
          predictions.map(
            (pred) =>
              `${pred.class} with ${Math.round(pred.score * 100)}% confidence`
          )
        );
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <img
        ref={imgRef}
        alt="uploaded"
        style={{ display: "block", marginTop: "10px", maxWidth: "100%" }}
      />
      <div>
        {results.map((result, index) => (
          <p key={index}>🔍 {result}</p>
        ))}
      </div>
    </div>
  );
};

export default ObjectDetection;
