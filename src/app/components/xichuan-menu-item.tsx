"use client";

import { useState } from "react";
import { Plus, Info, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { useCart } from "../providers/cart-provider";
import { MenuItem } from "../types";

interface XichuanMenuItemProps {
  item: MenuItem;
}

export function XichuanMenuItem({ item }: XichuanMenuItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    spiceLevel: item.spiceLevel || 1,
    noodleType: "hand-pulled" as "hand-pulled" | "wide" | "thin",
    extraToppings: [] as string[],
    specialInstructions: "",
  });
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      ...item,
      options: selectedOptions,
    });
    setIsModalOpen(false);
  };

  const calculatePrice = () => {
    let price = item.price;
    if (selectedOptions.extraToppings.length > 0) {
      price += selectedOptions.extraToppings.length * 2.0;
    }
    return price;
  };

  const availableToppings = [
    "Extra Beef",
    "Extra Pork",
    "Soft Boiled Egg",
    "Extra Vegetables",
    "Pickled Mustard Greens",
    "Bean Sprouts",
    "Extra Chili Oil",
  ];

  const getSpiceLevelText = (level: number) => {
    const levels = ["Mild", "Medium", "Spicy", "Very Spicy", "Fire Dragon"];
    return levels[level] || "Mild";
  };

  const getSpiceLevelColor = (level: number) => {
    const colors = [
      "text-green-600",
      "text-yellow-600",
      "text-orange-600",
      "text-red-600",
      "text-red-800",
    ];
    return colors[level] || "text-green-600";
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow"
        role="article"
        aria-labelledby={`item-${item.id}-name`}
        aria-describedby={`item-${item.id}-description`}
      >
        <div className="relative aspect-square">
          <img
            src={item.image}
            alt={`${item.name} - ${item.description}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {item.isSignature && (
            <Badge
              className="absolute top-4 left-4 text-white dark:text-white"
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              aria-label="Signature dish"
            >
              Signature
            </Badge>
          )}
          {item.isPopular && (
            <Badge
              className="absolute top-4 right-4 text-white dark:text-white"
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
              aria-label="Popular dish"
            >
              Popular
            </Badge>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3
              id={`item-${item.id}-name`}
              className="text-xl font-semibold text-foreground mb-2"
            >
              {item.name}
            </h3>
            <p
              id={`item-${item.id}-description`}
              className="text-muted-foreground text-sm mb-3"
            >
              {item.description}
            </p>

            {/* Dietary and spice info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              {item.isSpicy && (
                <div className="flex items-center gap-1">
                  <Flame
                    className={`h-3 w-3 ${getSpiceLevelColor(item.spiceLevel)}`}
                  />
                  <span className={getSpiceLevelColor(item.spiceLevel)}>
                    {getSpiceLevelText(item.spiceLevel)}
                  </span>
                </div>
              )}
              {item.isVegetarian && (
                <Badge variant="outline" className="text-xs">
                  Vegetarian
                </Badge>
              )}
              {item.isVegan && (
                <Badge variant="outline" className="text-xs">
                  Vegan
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              ${item.price.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsModalOpen(true)}
                aria-label={`View details and customize ${item.name}`}
              >
                <Info className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="text-white dark:text-white"
                style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                aria-label={`Add ${item.name} to cart for $${item.price.toFixed(
                  2
                )}`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-custom">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>
              Customize your order to your taste
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Dish image and description */}
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.ingredients && (
                  <p className="text-xs text-muted-foreground/80 mt-2">
                    Ingredients: {item.ingredients.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Spice Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Spice Level</Label>
              <div className="px-2">
                <Slider
                  value={[selectedOptions.spiceLevel]}
                  onValueChange={(value) =>
                    setSelectedOptions({
                      ...selectedOptions,
                      spiceLevel: value[0],
                    })
                  }
                  max={4}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Mild</span>
                  <span
                    className={getSpiceLevelColor(selectedOptions.spiceLevel)}
                  >
                    {getSpiceLevelText(selectedOptions.spiceLevel)}
                  </span>
                  <span>Fire Dragon</span>
                </div>
              </div>
            </div>

            {/* Noodle Type */}
            {item.category === "noodles" || item.category === "signature" ? (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Noodle Type</Label>
                <RadioGroup
                  value={selectedOptions.noodleType}
                  onValueChange={(value) =>
                    setSelectedOptions({
                      ...selectedOptions,
                      noodleType: value as any,
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hand-pulled" id="hand-pulled" />
                    <Label htmlFor="hand-pulled" className="font-normal">
                      Hand-Pulled (Traditional)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wide" id="wide" />
                    <Label htmlFor="wide" className="font-normal">
                      Wide Belt Noodles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thin" id="thin" />
                    <Label htmlFor="thin" className="font-normal">
                      Thin Noodles
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ) : null}

            {/* Extra Toppings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Extra Toppings (+$2.00 each)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {availableToppings.map((topping) => (
                  <div key={topping} className="flex items-center space-x-2">
                    <Checkbox
                      id={topping}
                      checked={selectedOptions.extraToppings.includes(topping)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOptions({
                            ...selectedOptions,
                            extraToppings: [
                              ...selectedOptions.extraToppings,
                              topping,
                            ],
                          });
                        } else {
                          setSelectedOptions({
                            ...selectedOptions,
                            extraToppings: selectedOptions.extraToppings.filter(
                              (t) => t !== topping
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={topping} className="font-normal text-sm">
                      {topping}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "hsl(var(--brand-accent))" }}
                >
                  ${calculatePrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 text-white dark:text-white"
              style={{ backgroundColor: "hsl(var(--brand-accent))" }}
            >
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
