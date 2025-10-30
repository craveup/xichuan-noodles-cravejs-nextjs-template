"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDescription from "./ProductDescription";
import type { ProductDescription as ProductDescriptionType } from "@/lib/api/types";
import { storefrontClient } from "@/lib/storefront-client";
import { toErrorMessage } from "@/lib/api/error-utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [product, setProduct] =
    useState<ProductDescriptionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      if (!open || !productId || !locationId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await storefrontClient.http.get<ProductDescriptionType>(
          `/api/v1/locations/${locationId}/products/${productId}`
        );
        if (!cancelled) {
          setProduct(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err));
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [open, productId, locationId]);

  const handleRetry = () => {
    if (!open) return;
    setProduct(null);
    setError(null);
    setIsLoading(true);
    storefrontClient.http
      .get<ProductDescriptionType>(
        `/api/v1/locations/${locationId}/products/${productId}`
      )
      .then((response) => {
        setProduct(response);
      })
      .catch((err) => {
        setError(toErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogOverlay className="fixed inset-0 bg-black/60" />
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Product details</DialogTitle>
        {isLoading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              {error || "Unable to load this product right now."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleRetry}>Try again</Button>
            </div>
          </div>
        ) : product ? (
          <ProductDescription product={product} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDescriptionDialog;
