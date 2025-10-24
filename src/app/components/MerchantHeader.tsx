// app/components/MerchantHeader.tsx
"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import type { MerchantApiResponse } from "@/types/merchant-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Car, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

type Props = { merchant: MerchantApiResponse };

export default function MerchantHeader({ merchant }: Props) {
  const { name, bio, cover, logo, locations } = merchant;

  const hasCover = Boolean(cover && cover.trim());
  const hasLogo = Boolean(logo && logo.trim());
  const totalLocations = locations.length;
  const locationLabel = totalLocations === 1 ? "1 Location" : `${totalLocations} Locations`;

  const methodSummary = locations.reduce(
    (acc, loc) => {
      const status = loc.methodsStatus;
      if (!status) return acc;

      return {
        delivery: acc.delivery || Boolean(status.delivery),
        pickup: acc.pickup || Boolean(status.pickup),
        dineIn: acc.dineIn || Boolean(status.table),
        roomService: acc.roomService || Boolean(status.roomService),
      };
    },
    { delivery: false, pickup: false, dineIn: false, roomService: false },
  );

  const orderingChips = [
    {
      key: "delivery",
      label: "Delivery",
      icon: <Car className="h-4 w-4" aria-hidden />,
      active: methodSummary.delivery,
    },
    {
      key: "pickup",
      label: "Pickup",
      icon: <ShoppingBag className="h-4 w-4" aria-hidden />,
      active: methodSummary.pickup,
    },
    {
      key: "dine-in",
      label: "Dine In",
      icon: <UtensilsCrossed className="h-4 w-4" aria-hidden />,
      active: methodSummary.dineIn,
    },
    {
      key: "room-service",
      label: "Room Service",
      icon: <Bed className="h-4 w-4" aria-hidden />,
      active: methodSummary.roomService,
    },
  ].filter((chip) => chip.active);

  const heroStyles = hasCover
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(12, 12, 12, 0.35), rgba(12, 12, 12, 0.05)), url(${cover})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : undefined;

  const fallbackInitial = name.charAt(0).toUpperCase();
  const hasBio = Boolean(bio && bio.trim());

  return (
    <header aria-label={`${name} overview`} className="border-b border-border/40 bg-muted/5">
      <Container>
        <div
          className="relative h-48 w-full overflow-hidden rounded-2xl border bg-muted shadow-sm sm:h-64 md:h-80"
          style={heroStyles}
        >
          {(hasLogo || fallbackInitial) && (
            <div
              className="absolute bottom-4 left-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border bg-background/90 p-2 shadow-lg backdrop-blur"
            >
              <ImageWithFallback
                src={hasLogo ? logo : undefined}
                alt={`${name} logo`}
                width={72}
                height={72}
                className="object-contain"
                sizes="80px"
                priority
                fallbackClassName="flex h-full w-full items-center justify-center"
                fallback={<span className="text-lg font-semibold text-muted-foreground">{fallbackInitial}</span>}
              />
            </div>
          )}
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-5 pb-10 pt-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-2">
              <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
                {name}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">{locationLabel}</Badge>
                {orderingChips.map((chip) => (
                  <Badge key={chip.key} variant="secondary" className="gap-1">
                    {chip.icon}
                    {chip.label}
                  </Badge>
                ))}
              </div>
            </div>

            {hasBio && (
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{bio}</p>
            )}
          </div>

          {totalLocations > 0 && (
            <Button
              type="button"
              size="lg"
              className="self-start md:self-auto"
              onClick={() => {
                const el = document.getElementById("locations");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              See Locations
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
