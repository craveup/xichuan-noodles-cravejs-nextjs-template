// app/(storefront)/page.tsx
import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { Container } from "@/components/ui/Container";
import MerchantHeader from "@/app/components/MerchantHeader";
import LocationsSection from "@/app/components/LocationsSection";
import type { MerchantApiResponse } from "@/types/merchant-types";
import { getMerchant } from "@/lib/api/merchant";
import { getLocationById } from "@/lib/api/location";
import type { GetLocationViaSlugType } from "@/types/location-types";

async function resolveStoreIdentifier(): Promise<string | null> {
  const storeIdentifier = process.env.NEXT_PUBLIC_ORG_SLUG?.trim();
  if (!storeIdentifier) {
    console.error("[storefront] NEXT_PUBLIC_ORG_SLUG env var is not set");
    return null;
  }
  return storeIdentifier;
}

function resolveDefaultLocationId(): string | null {
  const locationId = process.env.NEXT_PUBLIC_DEFAULT_LOCATION_ID?.trim();
  return locationId ? locationId : null;
}

async function loadMerchant(storeIdentifier: string | null): Promise<MerchantApiResponse | null> {
  if (!storeIdentifier) {
    return null;
  }
  try {
    return await getMerchant(storeIdentifier);
  } catch (error) {
    console.error("[storefront] failed to load merchant", { storeIdentifier, error });
    return null;
  }
}

async function loadLocation(locationId: string | null): Promise<GetLocationViaSlugType | null> {
  if (!locationId) {
    return null;
  }

  try {
    return await getLocationById(locationId);
  } catch (error) {
    console.error("[storefront] failed to load default location", { locationId, error });
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const defaultLocationId = resolveDefaultLocationId();
  if (defaultLocationId) {
    const location = await loadLocation(defaultLocationId);

    if (!location) {
      return {
        title: "Location Not Available",
        description: "The requested location could not be found.",
      };
    }

    const { restaurantDisplayName, restaurantBio, coverPhoto } = location;
    const description =
      restaurantBio?.trim() ||
      `Browse the ${restaurantDisplayName} menu, check availability, and start an order.`;

    return {
      title: `${restaurantDisplayName} — Menu & Ordering`,
      description,
      openGraph: {
        title: `${restaurantDisplayName} — Menu & Ordering`,
        description,
        type: "website",
        images: coverPhoto ? [{ url: coverPhoto }] : undefined,
      },
    };
  }

  const storeIdentifier = await resolveStoreIdentifier();
  const merchant = await loadMerchant(storeIdentifier);

  if (!merchant) {
    return {
      title: "Storefront",
      description: "Browse locations and place orders.",
    };
  }

  const { name, bio, cover } = merchant;
  const description = bio?.trim() || `Browse all ${name} locations and place orders for delivery, pickup, or dine in.`;

  return {
    title: `${name} — Locations & Ordering`,
    description,
    openGraph: {
      title: `${name} — Locations & Ordering`,
      description,
      type: "website",
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

export default async function StorefrontPage() {
  const defaultLocationId = resolveDefaultLocationId();
  if (defaultLocationId) {
    redirect(`/${encodeURIComponent(defaultLocationId)}`);
  }

  const storeIdentifier = await resolveStoreIdentifier();
  const merchant = await loadMerchant(storeIdentifier);

  if (!merchant) {
    notFound();
  }

  const { name, locations } = merchant;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-14">
        <MerchantHeader merchant={merchant} />

        <Container className="space-y-6 py-12 md:py-16" id="locations">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Our Locations</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Find a {name} location near you and choose your preferred ordering method.
            </p>
          </div>

          <LocationsSection locations={locations} />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
