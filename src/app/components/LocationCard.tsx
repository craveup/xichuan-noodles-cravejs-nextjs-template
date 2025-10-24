"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bed,
  Car,
  ChevronRight,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { MerchantLocation } from "@/types";

type MethodsStatus = MerchantLocation["methodsStatus"];

const METHOD_CONFIG: Array<{
  key: keyof MethodsStatus;
  label: string;
  icon: React.ReactNode;
  fulfillment: string;
}> = [
  {
    key: "delivery",
    label: "Delivery",
    icon: <Car className='h-3.5 w-3.5' aria-hidden />,
    fulfillment: "delivery",
  },
  {
    key: "pickup",
    label: "Pickup",
    icon: <ShoppingBag className='h-3.5 w-3.5' aria-hidden />,
    fulfillment: "pickup",
  },
  {
    key: "table",
    label: "Dine In",
    icon: <UtensilsCrossed className='h-3.5 w-3.5' aria-hidden />,
    fulfillment: "table",
  },
  {
    key: "roomService",
    label: "Room Service",
    icon: <Bed className='h-3.5 w-3.5' aria-hidden />,
    fulfillment: "room_service",
  },
];

export default function LocationCard({
  location,
}: {
  location: MerchantLocation;
}) {
  const activeMethods = METHOD_CONFIG.filter(
    ({ key }) => location.methodsStatus?.[key],
  );
  const [methodPickerOpen, setMethodPickerOpen] = useState(false);
  const router = useRouter();

  const hasCover = Boolean(location.coverPhoto && location.coverPhoto.trim());
  const hasLogo = Boolean(
    location.restaurantLogo && location.restaurantLogo.trim(),
  );
  const fallbackInitial =
    location.restaurantDisplayName.charAt(0)?.toUpperCase() ?? "";

  const navigateToLocation = (fulfillment: string) => {
    const targetUrl = `/${location.id}?fulfillment=${fulfillment}`;
    if (typeof window !== "undefined") {
      window.location.assign(targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  const handleStartOrder = () => {
    if (!activeMethods.length) return;
    if (activeMethods.length === 1) {
      navigateToLocation(activeMethods[0]!.fulfillment);
      return;
    }
    setMethodPickerOpen(true);
  };

  const handleSelectMethod = (fulfillment: string) => {
    setMethodPickerOpen(false);
    navigateToLocation(fulfillment);
  };

  return (
    <article className='bg-card text-card-foreground flex h-full flex-col gap-4 rounded-xl border p-5 shadow-sm'>
      <div className='bg-muted relative h-36 w-full overflow-hidden rounded-lg'>
        <ImageWithFallback
          src={hasCover ? location.coverPhoto : undefined}
          alt={`${location.restaurantDisplayName} cover`}
          fill
          className='object-cover'
          sizes='(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
        />

        {(hasLogo || fallbackInitial) && (
          <div className='bg-background/90 absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border p-1 shadow-sm'>
            <ImageWithFallback
              src={hasLogo ? location.restaurantLogo : undefined}
              alt={`${location.restaurantDisplayName} logo`}
              fill
              sizes='48px'
              className='object-cover'
            />
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-4'>
        <div className='space-y-1'>
          <h3 className='text-foreground text-lg font-semibold tracking-tight'>
            {location.restaurantDisplayName}
          </h3>
          {location.restaurantBio?.trim() && (
            <p className='text-muted-foreground line-clamp-2 text-sm'>
              {location.restaurantBio}
            </p>
          )}
        </div>

        <div className='mt-auto flex min-h-[100px] flex-col justify-between gap-3'>
          <div>
            {activeMethods.length ? (
              <div className='flex flex-wrap gap-2'>
                {activeMethods.map(({ key, label, icon }) => (
                  <Badge key={key} variant='secondary' className='gap-1'>
                    {icon}
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground/80 text-sm'>
                We&apos;ll open ordering for this location soon.
              </p>
            )}
          </div>
          <Button
            variant='outline'
            className='w-full'
            disabled={!activeMethods.length}
            onClick={handleStartOrder}
          >
            Start order
          </Button>
        </div>
      </div>

      <ResponsiveDialog
        open={methodPickerOpen}
        setOpen={setMethodPickerOpen}
        title='Choose how you want to order'
        hideMainBtn
        hideCloseBtn
      >
        <div className='space-y-3 px-1 py-4'>
          {activeMethods.map(({ key, label, icon, fulfillment }) => (
            <Button
              key={key}
              variant='outline'
              className='w-full justify-between gap-2'
              onClick={() => handleSelectMethod(fulfillment)}
            >
              <span className='flex items-center gap-2'>
                {icon}
                {label}
              </span>
              <ChevronRight
                className='text-muted-foreground h-4 w-4'
                aria-hidden
              />
            </Button>
          ))}
        </div>
      </ResponsiveDialog>
    </article>
  );
}
