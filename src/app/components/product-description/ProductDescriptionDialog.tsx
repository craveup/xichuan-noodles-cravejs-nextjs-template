"use client";

import * as React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDescriptionScreen } from "./ProductDescriptionScreen";
import type {
  Product,
  ProductDescription as ProductDescriptionType,
} from "@/lib/api/types";

interface ProductDescriptionDialogProps {
  open: boolean;
  productId: string;
  locationId?: string;
  product?: Product | ProductDescriptionType | null;
  canUseApi?: boolean;
  onClose: () => void;
}

const ProductDescriptionDialog = ({
  open,
  productId,
  locationId,
  product,
  canUseApi = true,
  onClose,
}: ProductDescriptionDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isOpen = open && Boolean(productId);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(next) => !next && onClose()}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/5 z-1050" />
          <DialogContent className="z-1051 h-[90vh] overflow-hidden border-none p-0">
            <VisuallyHidden>
              <DialogTitle>Product details</DialogTitle>
            </VisuallyHidden>
            {isOpen && productId ? (
              <ProductDescriptionScreen
                productId={productId}
                locationId={locationId ?? null}
                product={product ?? undefined}
                canUseApi={canUseApi}
                onClose={onClose}
              />
            ) : null}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent className="z-1051 h-[92vh] max-h-[92vh] overflow-hidden border border-border/40 bg-background p-0 shadow-[0_-20px_60px_rgba(5,10,20,0.65)]">
        <VisuallyHidden>
          <DrawerTitle>Product details</DrawerTitle>
        </VisuallyHidden>
        {isOpen && productId ? (
          <ProductDescriptionScreen
            productId={productId}
            locationId={locationId ?? null}
            product={product ?? undefined}
            canUseApi={canUseApi}
            onClose={onClose}
          />
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDescriptionDialog;
