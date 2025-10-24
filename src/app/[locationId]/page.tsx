// app/[locationId]/page.tsx
import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { getLocationById } from "@/lib/api/location";
import Header from "@/app/[locationId]/components/Header";
import OrderingSessionAndMenus from "@/app/[locationId]/components/OrderingSessionAndMenus";

type PageParams = { locationId: string };
type LocationOrderPageProps = { params: PageParams };

export const revalidate = 900; // 15 minutes

async function fetchLocationOrNull(locationId: string) {
  try {
    return await getLocationById(locationId);
  } catch (error) {
    console.error("[location-page] failed to fetch location", {
      locationId,
      error,
    });
    return null;
  }
}

export async function generateMetadata({
  params,
}: LocationOrderPageProps): Promise<Metadata> {
  const location = await fetchLocationOrNull(params.locationId);

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  const title = location.restaurantDisplayName?.trim() || params.locationId;
  const description = location.restaurantBio?.trim();

  return {
    title,
    description,
  };
}

export default async function LocationOrderPage({
  params,
}: LocationOrderPageProps) {
  const location = await fetchLocationOrNull(params.locationId);

  if (!location) {
    notFound();
  }

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <Navbar backHref='/' />
      <main>
        <Header location={location} />
        <OrderingSessionAndMenus location={location} />
      </main>
      <Footer />
    </div>
  );
}
