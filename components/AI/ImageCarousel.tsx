import React, { useEffect, useState } from "react";
import axios from "axios";
import LoaderClassic from "../ui/LoaderClassic";
import LoaderSpinner from "../ui/LoaderSpinner";
import { getBingImages } from "@/lib/getBingImages";
import ProxyImage from "../ProxyImage";

interface Props {
  recipeSaved: boolean;
  theQuery: string;
  theImgUrl: string;
  setTheImgUrl: (url: string) => void;
  fetchImagesTrigger?: boolean; // Optional prop to trigger re-fetching images
}
const ImageCarousel = ({
  recipeSaved,
  theQuery,
  theImgUrl,
  setTheImgUrl,
  fetchImagesTrigger = false, // Optional prop to trigger re-fetching images
}: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from the API
  const fetchImages = async () => {
    try {
      const imageUrls = await getBingImages(theQuery);

      setImages(imageUrls);
      setTheImgUrl(imageUrls[currentIndex]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images from the server");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImagesTrigger]);

  useEffect(() => {
    setTheImgUrl(images[currentIndex]);
  }, [currentIndex]);

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loops back to 0 when reaching the end
  };

  const goToPreviousImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    ); // Loops back to the end when going backward
  };

  if (loading)
    return (
      <div className="flex items-center justify-center mt-2 mb-8">
        <LoaderSpinner />
      </div>
    );
  if (error) return <div>{error} ⚠️</div>;

  return (
    <div className="carousel-container">
      <div className="carousel">
        {!recipeSaved && images.length > 0 && (
          <span className="flex gap-2 mb-1 mt-4">
            <button
              type="button"
              onClick={goToPreviousImage}
              className="carousel-btn btn btn-round"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={goToNextImage}
              className="carousel-btn btn btn-round"
            >
              ▶
            </button>
          </span>
        )}
        {/* Display current image */}
        <div className="carousel-item">
          {images.length > 0 && (
            <div className="relative ">
              {!loadedImages.includes(images[currentIndex]) && (
                <span className="absolute inset-0 z-[50] flex items-center justify-center">
                  <LoaderSpinner />
                </span>
              )}
              <ProxyImage
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                width={500}
                height={500}
                onLoad={() => {
                  if (!loadedImages.includes(images[currentIndex])) {
                    setLoadedImages((prev) => [...prev, images[currentIndex]]);
                  }
                }}
                styleBool={
                  loadedImages.includes(images[currentIndex]) ? true : false
                }
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="carousel-controls"></div>
      </div>
    </div>
  );
};

export default ImageCarousel;
