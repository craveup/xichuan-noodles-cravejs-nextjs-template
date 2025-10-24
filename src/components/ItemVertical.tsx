import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CircularLoader from "@/components/ui/CircularLoader";
import { Product } from "@/types/menu-types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ItemVerticalProps {
  product: Product;
  onClick: () => void;
  handleClickAddBtn: () => void;
  isLoading: boolean;
}

function ItemVertical({
  product,
  handleClickAddBtn,
  isLoading,
  onClick,
}: ItemVerticalProps) {
  const firstImage = product.images?.[0];

  return (
    <Card role='button' onClick={onClick} className='overflow-hidden pt-0 pb-4'>
      <div className='relative aspect-[4/3] w-full overflow-hidden bg-muted'>
        <ImageWithFallback
          className='object-cover'
          fill
          src={firstImage}
          alt={product.name}
        />

        <Button
          size='icon'
          variant='outline'
          className='absolute right-3 bottom-3 z-10'
          onClick={(event) => {
            // avoid triggering parent click
            event.stopPropagation();
            handleClickAddBtn();
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularLoader /> : <Plus />}
        </Button>
      </div>

      <CardHeader className='relative min-h-[74px] px-4'>
        <CardTitle className='line-clamp-1'>{product.name}</CardTitle>

        {product.description && (
          <CardDescription className='text-muted-foreground absolute top-7 left-4 line-clamp-1 text-xs'>
            {product.description}
          </CardDescription>
        )}

        <CardDescription className='text-foreground absolute bottom-0 left-4 font-semibold'>
          {product.displayPrice}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default ItemVertical;
