import React, { useEffect, useState } from "react";
import axios from "axios";
import LoaderClassic from "../ui/LoaderClassic";
import LoaderSpinner from "../ui/LoaderSpinner";

interface Props {
  recipeSaved: boolean;
  theQuery: string;
  theImgUrl: string;
  setTheImgUrl: (url: string) => void;
}
const ImageCarousel = ({
  recipeSaved,
  theQuery,
  theImgUrl,
  setTheImgUrl,
}: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post("/api/serpapi-img-search", {
          query: theQuery,
        }); // Change query as needed
        console.log(response);

        const imageUrls = response.data.data.images_results.map(
          (item: any) => item.thumbnail
        );
        setImages(imageUrls);
        setTheImgUrl(imageUrls[currentIndex]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to fetch images from the server");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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
        {!recipeSaved && (
          <span className="flex gap-2 mb-1">
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
          <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
        </div>

        {/* Navigation Buttons */}
        <div className="carousel-controls"></div>
      </div>
    </div>
  );
};

export default ImageCarousel;
