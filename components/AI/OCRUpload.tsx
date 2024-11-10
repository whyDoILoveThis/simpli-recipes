// Example frontend code (Next.js component)

"use client";

import { useState } from "react";

export default function OCRUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
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
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload and Extract Text"}
      </button>
      {ocrResult && <pre>{ocrResult}</pre>}
    </div>
  );
}
