"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XichuanMenuItem } from "./xichuan-menu-item";
import type { MenuItem } from "../types";
import type { Product } from "@/lib/api/types";
import { useMenuItems, useProducts } from "@/lib/api/hooks";
import { useCart } from "../providers/cart-provider";
import { ItemUnavailableActions } from "@craveup/storefront-sdk";
import ProductDescriptionDialog from "./product-description/ProductDescriptionDialog";
import { API_SETUP_MESSAGE } from "@/lib/api/config";

type MenuCategoryGroup = {
  key: string;
  label: string;
  items: MenuItem[];
};

const FALLBACK_IMAGE = "/images/xichuan-noodles/menu/biang_classic.webp";

const toPriceNumber = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const sanitized = value.replace(/[^0-9.+-]/g, "");
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const productToMenuItem = (
  product: Product,
  categoryLabel: string
): MenuItem => ({
  id: product.id,
  name: product.name,
  description: product.description ?? "Delicious menu item",
  price: toPriceNumber(product.displayPrice ?? product.price),
  image: product.images?.[0] ?? FALLBACK_IMAGE,
  category: categoryLabel,
  spiceLevel: 0,
  isSignature: false,
  isPopular: false,
  isSpicy: false,
  apiProduct: product,
});

export function XichuanMenu() {
  const {
    cart,
    locationId,
    isResolvingLocation,
    locationError,
    addToCart,
    usingApi,
  } = useCart();
  const resolvedLocationId = locationId ?? "";
  const cartId = cart?.id ?? null;
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [addingProductId, setAddingProductId] = useState<string>("");

  const menuQuery = useMenuItems(resolvedLocationId);
  const productsQuery = useProducts(resolvedLocationId, cartId);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    productsQuery.data?.forEach((product) => {
      map.set(product.id, product);
    });
    return map;
  }, [productsQuery.data]);
  const selectedProduct = selectedProductId
    ? productMap.get(selectedProductId) ?? null
    : null;

  const handleOpenProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleCloseProduct = () => {
    setSelectedProductId("");
  };

  const handleQuickAdd = async (product: Product) => {
    if (!product?.id) return;

    setAddingProductId(product.id);
    try {
      await addToCart({
        product,
        quantity: 1,
        selections: [],
        specialInstructions: "",
        itemUnavailableAction: ItemUnavailableActions.REMOVE_ITEM,
      });
    } finally {
      setAddingProductId("");
    }
  };

  const apiCategories = useMemo<MenuCategoryGroup[]>(() => {
    if (!menuQuery.data) {
      return [];
    }

    const activeMenu =
      menuQuery.data.menus.find((menu) => menu.isActive) ??
      menuQuery.data.menus[0];
    if (!activeMenu) {
      return [];
    }

    return activeMenu.categories
      .map((category) => {
        const byProductIds =
          Array.isArray((category as { productIds?: string[] }).productIds) &&
          (category as { productIds?: string[] }).productIds!.length > 0;

        let resolvedProducts: Product[] = [];

        if (byProductIds) {
          resolvedProducts = (category as { productIds: string[] }).productIds
            .map((productId) => productMap.get(productId))
            .filter((product): product is Product => Boolean(product));
        } else if (
          Array.isArray((category as { products?: Product[] }).products)
        ) {
          resolvedProducts = (category as { products?: Product[] }).products!;
        }

        const items = resolvedProducts.map((product) =>
          productToMenuItem(product, category.name)
        );

        return {
          key: category.id || category.name,
          label: category.name,
          items,
        };
      })
      .filter((category) => category.items.length > 0);
  }, [menuQuery.data, productMap]);

  const isFetchingApi =
    usingApi &&
    (isResolvingLocation ||
      menuQuery.isLoading ||
      productsQuery.isLoading ||
      menuQuery.isFetching ||
      productsQuery.isFetching);
  const categories = apiCategories;
  const showLocationError = Boolean(locationError) && !isResolvingLocation;
  const locationErrorMessage =
    locationError ?? "Storefront location is currently unavailable.";
  const shouldBlockWithError = showLocationError;
  const waitingForLocation = !usingApi && isResolvingLocation;
  const showSetupMessage = !usingApi && !isResolvingLocation;
  const setupMessage = locationError ? locationErrorMessage : API_SETUP_MESSAGE;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.key ?? ""
  );

  useEffect(() => {
    if (categories.length === 0) return;
    setSelectedCategory((current) =>
      categories.some((category) => category.key === current)
        ? current
        : categories[0]!.key
    );
  }, [categories]);

  const loading = isFetchingApi && apiCategories.length === 0;

  return (
    <section id="menu" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signature hand-pulled biang biang noodles to succulent cumin
            lamb dishes and delicate Xi&apos;an dumplings, each dish is prepared
            with authentic spices and centuries-old technique.
          </p>
        </div>

        {waitingForLocation ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">
              Connecting to the CraveUp API...
            </p>
          </div>
        ) : showSetupMessage ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{setupMessage}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        ) : shouldBlockWithError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{locationErrorMessage}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No menu items are available at the moment. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-12 flex h-auto w-full flex-nowrap items-stretch gap-1 rounded-2xl border border-border/60 bg-muted shadow-sm shadow-foreground/5 transition-colors dark:border-border/40 dark:bg-muted/30 p-1 sm:flex-wrap sm:justify-center sm:gap-2 sm:p-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.key}
                    value={category.key}
                    className="flex-1 min-w-0 px-1.5 py-1 text-[clamp(0.6rem,2.5vw,0.8rem)] capitalize tracking-tight sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent
                  key={category.key}
                  value={category.key}
                  className="mt-0"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => {
                      const productId = item.apiProduct?.id ?? item.id;
                      return (
                        <XichuanMenuItem
                          key={item.id}
                          item={item}
                          onCustomize={handleOpenProduct}
                          onQuickAdd={handleQuickAdd}
                          isAdding={addingProductId === productId}
                        />
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-16 rounded-2xl bg-muted/30 p-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Group Orders & Catering
              </h3>
              <div className="grid gap-8 md:grid-cols-2 text-center md:text-left">
                <div className="max-w-md mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left">
                  <h4 className="font-semibold mb-2">Large Group Meals</h4>
                  <p className="text-muted-foreground mb-4">
                    Perfect for families and gatherings. Order family-style
                    portions of our signature noodles and dumplings.
                  </p>
                  <Button
                    className="text-white dark:text-white hover:opacity-90"
                    style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                    disabled
                  >
                    Order Family Meals
                  </Button>
                </div>
                <div className="max-w-md mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left">
                  <h4 className="font-semibold mb-2">Corporate Catering</h4>
                  <p className="text-muted-foreground mb-4">
                    Bring the authentic taste of Xi&apos;an to your office with
                    our tailored catering packages.
                  </p>
                  <Button variant="outline" disabled>
                    Get Catering Quote
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedProductId &&
        (selectedProduct || (usingApi && resolvedLocationId)) ? (
          <ProductDescriptionDialog
            open={Boolean(selectedProductId)}
            productId={selectedProductId}
            locationId={resolvedLocationId}
            product={selectedProduct ?? undefined}
            canUseApi={usingApi && Boolean(resolvedLocationId)}
            onClose={handleCloseProduct}
          />
        ) : null}
      </div>
    </section>
  );
}
