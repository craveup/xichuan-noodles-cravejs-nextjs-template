"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import CircularLoader from "@/components/ui/CircularLoader";
import { Container } from "@/components/ui/Container";
import { useScrollSync } from "@/hooks/use-scroll-sync";
import useMenus from "@/hooks/useMenus";
import CategoryList from "@/app/[locationId]/components/CategoryList";
import CategoryTabs from "@/app/[locationId]/components/CategoryTabs";
import MenuSwitcher from "@/app/[locationId]/components/MenuSwitcher";
import useTabsHeight from "@/app/[locationId]/components/useTabsHeight";
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";
import type { BundleCategory, BundleMenu } from "@/types/menus";
import NoMenu from "./NoMenu";

const NAVBAR_HEIGHT = 56;
const TABS_GAP = 8;

function MenusCategoriesProducts() {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const tabsBarRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    errorMessage: menusError,
    mutate: mutateMenus,
  } = useMenus();
  const { orderSessionError } = useOrderInfoStore();
  // const popularProducts = data?.popularProducts ?? [];

  // Derive categories safely for hook dependencies
  const menus: BundleMenu[] = data?.menus ?? [];
  const selectedMenu: BundleMenu | undefined = menus[selectedMenuIndex];
  const categories: BundleCategory[] = useMemo(
    () => selectedMenu?.categories ?? [],
    [selectedMenu],
  );
  const categoriesCount = categories.length;
  const categorySignature = useMemo(
    () => categories.map((c, i) => c?.id ?? c?.name ?? i).join("|"),
    [categories],
  );

  const tabsHeight = useTabsHeight(
    tabsBarRef,
    `${menus.length}-${selectedMenuIndex}-${categorySignature}`,
  );

  const scrollOffset = useMemo(
    () => NAVBAR_HEIGHT + tabsHeight + TABS_GAP,
    [tabsHeight],
  );

  const { activeIndex, registerSection, reset, scrollToIndex } = useScrollSync({
    count: categoriesCount,
    offset: scrollOffset,
    dependencyKey: categorySignature,
  });

  useEffect(() => {
    if (selectedMenuIndex >= menus.length && menus.length > 0) {
      setSelectedMenuIndex(0);
    }
  }, [menus.length, selectedMenuIndex]);

  useEffect(() => {
    reset(0);
  }, [selectedMenuIndex, categorySignature, reset]);

  if (isLoading) {
    return (
      <Container className='min-h-40'>
        <CircularLoader />
      </Container>
    );
  }

  if (menusError) {
    return (
      <Container>
        <ErrorMessage
          className='mt-4'
          message={menusError}
          onClick={async () => await mutateMenus()}
        />
      </Container>
    );
  }

  if (!menus || menus.length === 0) {
    return <NoMenu />;
  }

  const selectedMenuIsActive = selectedMenu?.isActive ?? true;
  const isMenuOnly = Boolean(orderSessionError);
  const isMenuBlocked = isMenuOnly || !selectedMenuIsActive;

  return (
    <div className='mt-10'>
      <Container className='mb-4'>
        {/* Reserved slot for popular products carousel */}

        <MenuSwitcher
          menus={menus}
          selectedIndex={selectedMenuIndex}
          setSelectedMenuIndex={(idx) => {
            setSelectedMenuIndex(idx);
          }}
        />
      </Container>

      <CategoryTabs
        categories={categories}
        activeIndex={activeIndex}
        onTabClick={scrollToIndex}
        tabsBarRef={tabsBarRef}
      />

      <CategoryList
        categories={categories}
        registerSection={registerSection}
        scrollOffset={scrollOffset}
        isBlocked={isMenuBlocked}
      />
    </div>
  );
}

export default MenusCategoriesProducts;
