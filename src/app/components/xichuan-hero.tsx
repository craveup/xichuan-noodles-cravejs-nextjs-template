"use client";

import { Button } from "@/components/ui/button";
import { useThemeClasses } from "@/hooks/use-restaurant-theme";
import { ClientIcon } from "./client-icon";

export function XichuanHero() {
  const { getThemeClass } = useThemeClasses();

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')",
        }}
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="max-w-xl text-white dark:text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white dark:text-white">
            Authentic
            <span
              className="block text-4xl md:text-6xl mt-2"
              style={{ color: "hsl(var(--brand-accent))" }}
            >
              Xi'an Noodles
            </span>
          </h1>
          <p className="text-xl mb-8 text-white/80 dark:text-white/80 leading-relaxed tracking-wide">
            Hand-pulled biang biang noodles, bold flavors from the ancient Silk
            Road. Experience the authentic taste of Xi'an in every bite.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className={`${getThemeClass(
              "hero-cta"
            )} text-white dark:text-white hover:bg-[hsl(var(--brand-accent))]/90 transition-all duration-200`}
            style={{ backgroundColor: "hsl(var(--brand-accent))" }}
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="View our authentic Xi'an noodle menu"
          >
            <ClientIcon
              name="ChefHat"
              className="h-5 w-5 mr-2"
              aria-hidden="true"
            />
            Order Now
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-white dark:text-white border-white dark:border-white hover:bg-white hover:text-foreground"
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Learn about our Xi'an heritage and story"
          >
            <ClientIcon
              name="Info"
              className="h-5 w-5 mr-2"
              aria-hidden="true"
            />
            Our Story
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ClientIcon
          name="ChevronDown"
          className="h-6 w-6 text-white/60"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
