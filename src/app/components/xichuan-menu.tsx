"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XichuanMenuItem } from "./xichuan-menu-item";
import { menuData } from "../data/menu-data";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";

export function XichuanMenu() {
  const [selectedCategory, setSelectedCategory] = useState("signature");
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(true);

  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID;
  if (!locationId) {
    throw new Error("NEXT_PUBLIC_LOCATION_ID environment variable is required");
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts(locationId);
        setApiProducts(products);
        setUseApi(true);
      } catch (error) {
        console.warn(
          "Failed to load products from API, using fallback data:",
          error
        );
        setUseApi(false);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [locationId]);

  // Convert API products to menu format
  const getMenuFromApi = () => {
    if (!useApi || apiProducts.length === 0) return menuData;

    const itemsPerCategory = Math.ceil(apiProducts.length / 5);

    return {
      signature: apiProducts.slice(0, itemsPerCategory).map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description || "Authentic Xi'an specialty",
        price: product.price,
        image:
          product.images?.[0] ||
          "/images/xichuan-noodles/menu/biang_classic.webp",
        category: "signature",
        spiceLevel: Math.floor(Math.random() * 3) + 1,
        isSignature: true,
      })),
      noodles: apiProducts
        .slice(itemsPerCategory, itemsPerCategory * 2)
        .map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description || "Hand-pulled noodles",
          price: product.price,
          image:
            product.images?.[0] ||
            "/images/xichuan-noodles/menu/beef_biang.webp",
          category: "noodles",
          spiceLevel: Math.floor(Math.random() * 3) + 1,
        })),
      dumplings: apiProducts
        .slice(itemsPerCategory * 2, itemsPerCategory * 3)
        .map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description || "Traditional dumplings",
          price: product.price,
          image:
            product.images?.[0] ||
            "/images/xichuan-noodles/menu/cumin_lamb.webp",
          category: "dumplings",
          spiceLevel: Math.floor(Math.random() * 3) + 1,
        })),
      appetizers: apiProducts
        .slice(itemsPerCategory * 3, itemsPerCategory * 4)
        .map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description || "Traditional appetizer",
          price: product.price,
          image:
            product.images?.[0] ||
            "/images/xichuan-noodles/menu/biang_classic.webp",
          category: "appetizers",
          spiceLevel: Math.floor(Math.random() * 2) + 1,
        })),
      beverages: apiProducts.slice(itemsPerCategory * 4).map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description || "Refreshing beverage",
        price: product.price,
        image:
          product.images?.[0] ||
          "/images/xichuan-noodles/menu/biang_classic.webp",
        category: "beverages",
        spiceLevel: 0,
      })),
    };
  };

  const currentMenu = getMenuFromApi();

  return (
    <section id="menu" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signature hand-pulled biang biang noodles to traditional Xi'an
            dumplings, each dish is prepared with authentic spices and
            techniques passed down through generations.
          </p>
          {useApi && (
            <div className="mt-4 text-sm text-green-600 dark:text-green-400">
              ✓ Connected to CraveUp API
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-12">
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="noodles">Noodles</TabsTrigger>
                <TabsTrigger value="dumplings">Dumplings</TabsTrigger>
                <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
                <TabsTrigger value="beverages">Beverages</TabsTrigger>
              </TabsList>

              {/* Signature Dishes */}
              <TabsContent value="signature" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.signature.map((item) => (
                    <XichuanMenuItem
                      key={item.id}
                      item={{ ...item, category: "signature" as const }}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Noodles */}
              <TabsContent value="noodles" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.noodles.map((item) => (
                    <XichuanMenuItem
                      key={item.id}
                      item={{ ...item, category: "signature" as const }}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Dumplings */}
              <TabsContent value="dumplings" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.dumplings.map((item) => (
                    <XichuanMenuItem
                      key={item.id}
                      item={{ ...item, category: "signature" as const }}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Appetizers */}
              <TabsContent value="appetizers" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.appetizers.map((item) => (
                    <XichuanMenuItem
                      key={item.id}
                      item={{ ...item, category: "signature" as const }}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Beverages */}
              <TabsContent value="beverages" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.beverages.map((item) => (
                    <XichuanMenuItem
                      key={item.id}
                      item={{ ...item, category: "signature" as const }}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Catering Section */}
            <div className="mt-16 bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Group Orders & Catering
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Large Group Meals</h4>
                  <p className="text-muted-foreground mb-4">
                    Perfect for families and groups. Order family-style portions
                    of our signature noodles and dumplings.
                  </p>
                  <Button
                    className="text-white dark:text-white hover:opacity-90"
                    style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                  >
                    Order Family Meals
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Corporate Catering</h4>
                  <p className="text-muted-foreground mb-4">
                    Bring the authentic taste of Xi'an to your office events
                    with our catering packages.
                  </p>
                  <Button variant="outline">Get Catering Quote</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
