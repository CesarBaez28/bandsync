'use cliente';

import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

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

  const validSrc = src && src !== "" ? src : fallBackSrc;
  const [imgSrc, setImgSrc] = useState(validSrc);

  useEffect(() => {
    setImgSrc(validSrc);
  }, [validSrc]);

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