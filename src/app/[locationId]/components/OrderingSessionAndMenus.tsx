// app/[locationId]/components/OrderingSessionAndMenus.tsx
"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import CircularLoader from "@/components/ui/CircularLoader";
import { Container } from "@/components/ui/Container";
import CartButton from "@/app/[locationId]/components/CartButton";
import FulfilmentMethodPanel from "@/app/[locationId]/components/FulfilmentMethodPanel";
import MenuOnlyBadge from "@/app/[locationId]/components/MenuOnlyBadge";
import MenusCategoriesProducts from "@/app/[locationId]/components/MenusCategoriesProducts";
import { useOrderInfoStore } from "@/app/[locationId]/store/orderInfo-store";
import { useOrderingSession } from "@/hooks/use-ordering-session";
import type { GetLocationViaSlugType } from "@/types/location-types";

type Props = {
  location: GetLocationViaSlugType;
};

function OrderingSessionAndMenus({ location }: Props) {
  const searchParams = useSearchParams();

  const { status, error } = useOrderingSession({
    locationId: location.id,
    preferredFulfillment: searchParams.get("fulfillment"),
  });

  const { setAddressInfo } = useOrderInfoStore();

  useEffect(() => {
    setAddressInfo({
      addressString: location.addressString,
      lat: location.addressData?.lat ?? null,
      lng: location.addressData?.lng ?? null,
    });
  }, [location.addressString, location.addressData?.lat, location.addressData?.lng, setAddressInfo]);

  if (status === "loading") {
    return (
      <Container className="flex justify-center py-24">
        <CircularLoader />
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="my-12">
        <ErrorMessage message={error ?? "We couldn't start an ordering session."} />
      </Container>
    );
  }

  return (
    <div>
      <Container className="space-y-6">
        <MenuOnlyBadge />
        <FulfilmentMethodPanel />
      </Container>

      <MenusCategoriesProducts />
      <CartButton />
    </div>
  );
}

export default OrderingSessionAndMenus;
