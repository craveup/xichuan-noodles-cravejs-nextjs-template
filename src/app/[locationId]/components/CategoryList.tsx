"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import NoMenu from "./NoMenu";
import Item from "@/components/Item";
import type { BundleCategory } from "@/types/menus";

interface CategoryListProps {
  categories: BundleCategory[];
  registerSection: (index: number) => (element: HTMLElement | null) => void;
  scrollOffset: number;
  isBlocked?: boolean;
}

export function CategoryList({
  categories,
  registerSection,
  scrollOffset,
  isBlocked = false,
}: CategoryListProps) {
  if (!categories.length) {
    return (
      <Container>
        <div className="mt-8 space-y-10">
          <NoMenu message="No Category Available" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mt-8 space-y-10">
        {categories.map((category, index: number) => (
          <section
            key={category.id}
            ref={registerSection(index)}
            style={{ scrollMarginTop: scrollOffset }}
          >
            <h3 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
              {category.name}
            </h3>

            <div className='items-center gap-8 md:grid md:w-full md:grid-cols-2'>
              {category.products.map((product) => (
                <Item product={product} key={product.id} isBlocked={isBlocked} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}

export default CategoryList;
