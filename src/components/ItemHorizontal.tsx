// ItemHorizontal.tsx
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CircularLoader from "@/components/ui/CircularLoader";
import { Product } from "@/types/menu-types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface CategoryProductProps {
  product: Product;
  onClick: () => void;
  handleClickAddBtn: () => void;
  isLoading: boolean;
}

const ItemHorizontal = ({
  product,
  onClick,
  handleClickAddBtn,
  isLoading,
}: CategoryProductProps) => {
  const firstImage = product.images[0];

  return (
    <div className='relative !min-w-36'>
      <button key={product.id} onClick={onClick} className='w-full'>
        <div className='border-border mt-4 flex items-stretch justify-between gap-3 overflow-hidden rounded-xl border sm:gap-4'>
          {/* Text column */}
          <div className='min-w-0 flex h-[120px] flex-1 flex-col justify-between p-4 text-left sm:p-5'>
            <div className='min-w-0'>
              <p className='truncate text-base font-semibold leading-tight sm:text-lg' title={product.name}>
                {product.name}
              </p>
              {product.description && (
                <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                  {product.description}
                </p>
              )}
            </div>
            <p className='text-sm font-medium'>{product.displayPrice}</p>
          </div>

          <div className='relative z-10 h-[120px] w-[140px] shrink-0 overflow-hidden rounded-l-xl bg-muted'>
            <ImageWithFallback
              className='object-cover'
              fill
              src={firstImage}
              alt={product.name}
              sizes='140px'
            />
          </div>
        </div>
      </button>

      <Button
        size='icon'
        variant='outline'
        className='absolute right-2 bottom-2 z-10 sm:right-3 sm:bottom-3'
        onClick={(event) => {
          // to avoid parent click as well
          event.stopPropagation();
          handleClickAddBtn();
        }}
        disabled={isLoading}
      >
        {isLoading ? <CircularLoader /> : <Plus />}
      </Button>
    </div>
  );
};

export default ItemHorizontal;
