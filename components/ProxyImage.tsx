"use client";

import Image from "next/image";
import { FC } from "react";

type ProxyImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  styleBool?: boolean; // Optional prop for conditional styling
};

const ProxyImage: FC<ProxyImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
  priority = false,
  onLoad,
  styleBool = false, // Optional prop for conditional styling
}) => {
  const proxySrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;

  return (
    <Image
      onLoad={onLoad}
      src={proxySrc}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-md ${className}`}
      priority={priority}
      style={{
        opacity: styleBool ? "1" : "0.35",
      }}
    />
  );
};

export default ProxyImage;
