"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type {
  Product,
  ProductDescription as ProductDescriptionType,
} from "@/lib/api/types";
import { storefrontClient } from "@/lib/storefront-client";
import { toErrorMessage } from "@/lib/api/error-utils";
import ProductDescription from "./ProductDescription";
import ProductDescriptionSkeleton from "./ProductDescriptionSkeleton";

interface ProductDescriptionScreenProps {
  productId: string;
  locationId?: string | null;
  product?: ProductDescriptionType | Product | null;
  canUseApi?: boolean;
  onClose: () => void;
}

type DescribableProduct = ProductDescriptionType | Product;

export const ProductDescriptionScreen = ({
  productId,
  locationId,
  product: initialProduct,
  canUseApi = true,
  onClose,
}: ProductDescriptionScreenProps) => {
  const [product, setProduct] = useState<DescribableProduct | null>(
    initialProduct ?? null
  );
  const [isLoading, setIsLoading] = useState(() => Boolean(canUseApi));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!canUseApi || !productId || !locationId) {
      setProduct(initialProduct ?? null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await storefrontClient.http.get<ProductDescriptionType>(
        `/api/v1/locations/${locationId}/products/${productId}`
      );
      setProduct(response);
    } catch (err) {
      setProduct(null);
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [canUseApi, initialProduct, locationId, productId]);

  useEffect(() => {
    if (!productId) return;
    if (!canUseApi || !locationId) {
      setProduct(initialProduct ?? null);
      setIsLoading(false);
      return;
    }
    void fetchProduct();
  }, [canUseApi, fetchProduct, initialProduct, locationId, productId]);

  if (!productId) {
    return null;
  }

  if (isLoading && !product) {
    return <ProductDescriptionSkeleton />;
  }

  if (error && !product) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => void fetchProduct()}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductDescriptionSkeleton />;
  }

  return (
    <ProductDescription
      product={product as ProductDescriptionType}
      onClose={onClose}
    />
  );
};
