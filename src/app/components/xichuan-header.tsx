"use client";

import { useCart } from "../providers/cart-provider";
import { useThemeClasses } from "@/hooks/use-restaurant-theme";
import { ClientIcon } from "./client-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface XichuanHeaderProps {
  onCartClick?: () => void;
}

export function XichuanHeader({ onCartClick }: XichuanHeaderProps) {
  const { itemCount, openCart } = useCart();
  const { getThemeClass } = useThemeClasses();

  return (
    <header className="sticky top-0 z-50 bg-background border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go to Xichuan Noodles home page"
          >
            <h1
              className={`text-2xl font-bold tracking-tight ${getThemeClass(
                "header-logo"
              )} text-[hsl(var(--brand-accent))]`}
            >
              西川面馆
            </h1>
            <span
              className={`ml-3 text-sm tracking-wider ${getThemeClass(
                "header-tagline"
              )} text-muted-foreground`}
            >
              XICHUAN NOODLES
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#menu"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View our menu"
            >
              Menu
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Learn about our story"
            >
              About
            </a>
            <a
              href="/locations"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Find our locations"
            >
              Locations
            </a>
          </nav>

          {/* Cart and Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick || openCart}
              className="relative"
              aria-label={`View cart with ${itemCount} items`}
            >
              <ClientIcon
                name="ShoppingCart"
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span className="ml-2 hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center p-0 text-white dark:text-white"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                  aria-label={`${itemCount} items in cart`}
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
