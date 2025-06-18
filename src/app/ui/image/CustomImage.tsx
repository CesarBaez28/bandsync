'use cliente';

import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type CustomImageProps = {
  src?: string,
  alt: string,
  fallBackSrc?: string,
  width: number,
  height: number,
  className?: string
} & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export default function CustomImage({
  src,
  alt,
  fallBackSrc,
  width,
  height,
  className,
  ...props
}: CustomImageProps) {

  const [imgSrc, setImgSrc] = useState(src !== "" ? src : fallBackSrc);

  console.log(imgSrc);

  const handleError = () => {
    if (imgSrc != fallBackSrc) {
      setImgSrc(fallBackSrc);
    }
  }

  return (
    <Image
      src={imgSrc ?? ""}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      className={clsx(className)}
      {...props}
    />
  );
}