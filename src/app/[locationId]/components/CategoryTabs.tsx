"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import TabsBorder from "@/app/[locationId]/components/TabsBorder";
import type { BundleCategory } from "@/types/menus";

interface CategoryTabsProps {
  categories: BundleCategory[];
  activeIndex: number;
  onTabClick: (index: number) => void;
  tabsBarRef: React.RefObject<HTMLDivElement | null>;
}

export function CategoryTabs({
  categories,
  activeIndex,
  onTabClick,
  tabsBarRef,
}: CategoryTabsProps) {
  return (
    <div className='sticky top-14 z-40 border-b'>
      <Container>
        <div ref={tabsBarRef} className='scrollbar-none overflow-x-auto'>
          <TabsBorder
            categories={categories}
            activeIndex={activeIndex}
            onTabClick={onTabClick}
          />
        </div>
      </Container>
    </div>
  );
}

export default CategoryTabs;
