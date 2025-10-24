"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";
import LocationCard from "@/app/components/LocationCard";
import type { MerchantLocation } from "@/types";

type Props = { locations: MerchantLocation[] };

export default function LocationsSection({ locations }: Props) {
  if (!locations?.length) {
    return (
      <div className="py-12 text-center">
        <UtensilsCrossed className="mx-auto mb-4 h-14 w-14 text-muted-foreground/60" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">No locations found</h3>
        <p className="text-sm text-muted-foreground">This merchant doesn&apos;t have any active locations yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}
