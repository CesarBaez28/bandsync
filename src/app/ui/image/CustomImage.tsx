'use client';

import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { ReactNode, useEffect, useState } from "react";
import styles from '@/ui/image/custom-image.module.css'

type CustomImageProps = {
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
  width: number;
  height: number;
  className?: string;
} & Omit<ImageProps, "src" | "alt" | "width" | "height">;

export default function CustomImage({
  src,
  alt,
  fallback,
  width,
  height,
  className,
  ...props
}: CustomImageProps) {

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidSrc = typeof src === "string" && src.trim().length > 0;

  if (!isValidSrc || hasError) {
    return (
      <div style={{ width, height }} className={clsx(styles.imageError, className)}>
        {fallback ?? (
          <span>
            Imagen no disponible
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      loading="eager"
      alt={alt}
      width={width}
      height={height}
      className={clsx(className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}