"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { ChefHat } from "lucide-react";

import { cn } from "@/lib/utils";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: React.ReactNode;
  fallbackClassName?: string;
};

export function ImageWithFallback({
  src,
  alt,
  fallback,
  fallbackClassName,
  className,
  ...imageProps
}: ImageWithFallbackProps) {
  if (src) {
    return <Image src={src} alt={alt} className={className} {...imageProps} />;
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted text-muted-foreground",
        fallbackClassName,
      )}
    >
      {fallback ?? <ChefHat className="h-5 w-5" aria-hidden="true" />}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
