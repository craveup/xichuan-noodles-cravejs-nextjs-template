import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { imagePlaceholder } from "@/constants";

interface ItemCarouselProps {
  images: string[];
  altText?: string;
}

export function ItemImagesCarousel({
  images,
  altText = "Product image",
}: ItemCarouselProps) {
  const filtered = (images ?? []).filter(
    (img) => typeof img === "string" && img.trim() !== "",
  );
  const slides = filtered.length > 0 ? filtered : ["/placeholder.svg"];
  return (
    <Carousel
      aria-label='Product images'
      opts={{ loop: slides.length > 1 }}
      className='group relative w-full'
    >
      <CarouselContent className='-ml-1'>
        {slides.map((image, index) => (
          <CarouselItem key={`${image}-${index}`} className='pl-1'>
            <div className='p-1'>
              <div className='relative h-80 w-full overflow-hidden rounded-xl'>
                <Image
                  src={image}
                  className='object-cover'
                  alt={
                    images.length > 0 ? altText : "No product image available"
                  }
                  placeholder='blur'
                  fill
                  blurDataURL={imagePlaceholder}
                  sizes='(min-width: 768px) 600px, 100vw'
                  priority={index === 0}
                  draggable={false}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 && (
        <div>
          <CarouselPrevious className='absolute top-1/2 left-2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
          <CarouselNext className='absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
        </div>
      )}
    </Carousel>
  );
}
