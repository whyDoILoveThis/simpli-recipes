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
};

const ProxyImage: FC<ProxyImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
  priority = false,
}) => {
  const proxySrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;

  return (
    <Image
      src={proxySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
};

export default ProxyImage;
