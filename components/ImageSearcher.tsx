import React, { use, useEffect, useState } from "react";
import ItsSearchbar from "./ui/ItsSearchbar";
import Image from "next/image";
import ImageCarousel from "./AI/ImageCarousel";
import fetchRecipeImage from "@/lib/fetchRecipeImage";
import GoogleColorLogo from "./icons/GoogleColorLogo";
import GoogleSolidLogo from "./icons/GoogleSolidLogo";
import UnsplashLogo from "./icons/UnsplashLogo";
import ProxyImage from "./ProxyImage";
import LoaderSpinner from "./ui/LoaderSpinner";

interface Props {
  setCurrentImgUrlCopy?: (url: string) => void;
  initialSearchTerm?: string; // Optional prop for initial search term
}

const ImageSearcher = ({ setCurrentImgUrlCopy, initialSearchTerm }: Props) => {
  const [imageSearchTerm, setImageSearchTerm] = useState(
    initialSearchTerm || ""
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [bingImgUrls, setBingImgUrls] = useState<string[]>([]);
  const [usingUnsplash, setUsingUnsplash] = useState(true);
  const [imgSearchIndex, setImgSearchIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [fetchBingImagesTrigger, setFetchBingImagesTrigger] = useState(false);

  const handleNextImg = async () => {
    setImgSearchIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    console.log(currentImgUrl);
  };
  const handlePrevImg = async () => {
    setImgSearchIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  const TriggerBingImagesFetch = () => {
    setFetchBingImagesTrigger(!fetchBingImagesTrigger);
  };

  useEffect(() => {
    handleUnsplashSearch();
  }, []);

  const handleUnsplashSearch = async () => {
    setImageUrls(await fetchRecipeImage(imageSearchTerm));
  };

  const onSearch = () => {
    if (usingUnsplash) handleUnsplashSearch();
  };

  useEffect(() => {
    setCurrentImgUrl(imageUrls[0]);
  }, [imageUrls]);

  useEffect(() => {
    setCurrentImgUrl(imageUrls[imgSearchIndex]);
  }, [imgSearchIndex]);

  useEffect(() => {
    if (setCurrentImgUrlCopy) {
      setCurrentImgUrlCopy(currentImgUrl);
    }
  }, [currentImgUrl]);

  console.log(imageUrls);
  console.log(imgSearchIndex);
  console.log(currentImgUrl);
  console.log(imageSearchTerm);

  return (
    <div>
      <div className="flex flex-col mb-6">
        <span className="flex flex-col gap-1 items-center">
          <p>
            <b>Search image with </b>
          </p>
          <span className="flex items-center gap-1">
            <button
              type="button"
              className={`flex items-center btn ${
                usingUnsplash && "btn-unsplash"
              } font-bold`}
              onClick={() => {
                setUsingUnsplash(true);
                if (!usingUnsplash) {
                  handleUnsplashSearch();
                }
              }}
            >
              <span className="-translate-y-[2px]">
                <UnsplashLogo />
              </span>
              Unsplash
            </button>
            or
            <button
              type="button"
              className={`flex items-center btn ${
                !usingUnsplash && "btn-google"
              } font-bold`}
              onClick={() => {
                setUsingUnsplash(false);
                TriggerBingImagesFetch();
              }}
            >
              {!usingUnsplash ? <GoogleColorLogo /> : <GoogleSolidLogo />}
              oogle
            </button>
          </span>
        </span>
      </div>

      <ItsSearchbar
        searchbarAsAnimatedButton={true}
        searchbarWidth="240px"
        searchTerm={imageSearchTerm}
        setSearchTerm={setImageSearchTerm}
        onSearch={onSearch}
      />

      {imageUrls && usingUnsplash ? (
        <div>
          {currentImgUrl && (
            <span className="flex gap-2 mb-1 mt-4">
              <button
                type="button"
                onClick={handlePrevImg}
                className="carousel-btn btn btn-round"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleNextImg}
                className="carousel-btn btn btn-round"
              >
                ▶
              </button>
            </span>
          )}
          {currentImgUrl && (
            <div className="relative">
              {!loadedImages.includes(currentImgUrl) && (
                <span className="absolute inset-0 z-[50] flex items-center justify-center">
                  <LoaderSpinner />
                </span>
              )}
              <ProxyImage
                width={500}
                height={500}
                src={currentImgUrl}
                alt="unsplash stock image"
                onLoad={() => {
                  if (!loadedImages.includes(currentImgUrl)) {
                    setLoadedImages((prev) => [...prev, currentImgUrl]);
                  }
                }}
                styleBool={loadedImages.includes(currentImgUrl) ? true : false}
              />
            </div>
          )}
        </div>
      ) : (
        !usingUnsplash && (
          <ImageCarousel
            recipeSaved={false}
            theImgUrl={currentImgUrl}
            setTheImgUrl={setCurrentImgUrl}
            theQuery={imageSearchTerm}
            fetchImagesTrigger={fetchBingImagesTrigger} // Trigger re-fetching images when using Google
          />
        )
      )}
    </div>
  );
};

export default ImageSearcher;
