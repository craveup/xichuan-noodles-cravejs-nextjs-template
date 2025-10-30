"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDescriptionScreen } from "./ProductDescriptionScreen";

interface ProductDescriptionDialogProps {
  open: boolean;
  productId: string;
  locationId: string;
  onClose: () => void;
}

const ProductDescriptionDialog = ({
  open,
  productId,
  locationId,
  onClose,
}: ProductDescriptionDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isOpen = open && Boolean(productId);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/60" />
        <DialogContent className="z-1051 h-[90vh] w-full max-w-2xl overflow-hidden border-none p-0">
          <DialogTitle className="sr-only">Product details</DialogTitle>
          {isOpen && productId ? (
            <ProductDescriptionScreen
              productId={productId}
              locationId={locationId}
              onClose={onClose}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="z-1051 h-[90vh] overflow-hidden border-none p-0"
      >
        {isOpen && productId ? (
          <ProductDescriptionScreen
            productId={productId}
            locationId={locationId}
            onClose={onClose}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescriptionDialog;
