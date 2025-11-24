"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XichuanHeader } from "../components/xichuan-header";
import { XichuanCart } from "../components/xichuan-cart";
import { XichuanFooter } from "../components/xichuan-footer";
import { ClientIcon } from "../components/client-icon";
import { useCart } from "../providers/cart-provider";
import { fetchLocation, fetchMerchant } from "@/lib/api/client";
import type { MerchantLocation } from "@/lib/api/types";
import { toErrorMessage } from "@/lib/api/error-utils";

interface Location {
  id: string;
  name: string;
  address?: string;
  neighborhood?: string;
  phone?: string;
  hours?: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
  };
  rating?: number;
  reviewCount?: number;
  features?: string[];
  image?: string;
  logo?: string;
  bio?: string;
  isMainLocation?: boolean;
  orderingAvailable?: boolean;
  deliveryRadius?: string;
  pickupAvailable?: boolean;
  methodsStatus?: MerchantLocation["methodsStatus"];
}

const FALLBACK_LOCATION_IMAGE =
  "https://images.unsplash.com/photo-1529007196863-d07650a3f0ea?q=80&w=1200&auto=format&fit=crop";

const getMapsUrl = (address: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;

export default function XichuanLocationsPage() {
  const {
    isCartOpen,
    closeCart,
    locationId,
    organizationSlug,
    isResolvingLocation,
    locationError,
  } = useCart();

  const resolvedLocationId = locationId ?? "";
  const resolvedSlug = organizationSlug ?? null;
  const preferApi = Boolean(resolvedLocationId);
  const waitingForLocation = isResolvingLocation && !resolvedLocationId;

  const locationQuery = useQuery({
    queryKey: ["location-meta", resolvedLocationId],
    queryFn: () => fetchLocation(resolvedLocationId),
    enabled: preferApi,
    staleTime: 60 * 60 * 1000,
  });

  const derivedSlug =
    locationQuery.data?.restaurantSlug ?? resolvedSlug ?? null;

  const merchantQuery = useQuery({
    queryKey: ["merchant", derivedSlug],
    queryFn: () => fetchMerchant(derivedSlug!),
    enabled: preferApi && Boolean(derivedSlug),
    staleTime: 10 * 60 * 1000,
  });

  const merchantLocations = useMemo<Location[]>(() => {
    if (!merchantQuery.data) return [];

    return merchantQuery.data.locations.map((loc) => {
      const methods = loc.methodsStatus ?? {};
      const methodFeatures = [
        methods.pickup && "Pickup",
        methods.delivery && "Delivery",
        methods.table && "Dine In",
        methods.roomService && "Room Service",
      ].filter(Boolean) as string[];

      const hasActiveMethod = Object.values(methods).some((value) =>
        Boolean(value)
      );
      const orderingAvailable = hasActiveMethod;

      const extraFields = loc as unknown as {
        rating?: number;
        reviewCount?: number;
        contactPhone?: string;
        phoneNumber?: string;
        deliveryRadius?: string;
        restaurantName?: string;
        isMainLocation?: boolean;
      };
      const rating =
        typeof extraFields.rating === "number" ? extraFields.rating : undefined;
      const reviewCount =
        typeof extraFields.reviewCount === "number"
          ? extraFields.reviewCount
          : undefined;
      const phone =
        typeof extraFields.contactPhone === "string"
          ? extraFields.contactPhone
          : typeof extraFields.phoneNumber === "string"
          ? extraFields.phoneNumber
          : undefined;

      return {
        id: loc.id,
        name:
          loc.restaurantDisplayName ||
          extraFields.restaurantName ||
          "Restaurant",
        address: loc.addressString ?? undefined,
        neighborhood: undefined,
        phone,
        hours: undefined,
        rating,
        reviewCount,
        features: methodFeatures,
        image: loc.coverPhoto || FALLBACK_LOCATION_IMAGE,
        logo: loc.restaurantLogo,
        bio: loc.restaurantBio ?? undefined,
        isMainLocation: Boolean(extraFields.isMainLocation),
        orderingAvailable,
        deliveryRadius:
          typeof extraFields.deliveryRadius === "string"
            ? extraFields.deliveryRadius
            : undefined,
        pickupAvailable: methods.pickup ?? undefined,
        methodsStatus: methods,
      };
    });
  }, [merchantQuery.data]);

  const hasMerchantLocations = merchantLocations.length > 0;
  const usingApi = preferApi && hasMerchantLocations;
  const loading =
    (preferApi && (locationQuery.isLoading || merchantQuery.isLoading)) ||
    waitingForLocation;
  const displayLocations = preferApi ? merchantLocations : [];
  const apiError = preferApi
    ? locationError ??
      (locationQuery.error ? toErrorMessage(locationQuery.error) : null) ??
      (merchantQuery.error ? toErrorMessage(merchantQuery.error) : null)
    : null;

  const locationCount = displayLocations.length;
  const ratings = displayLocations
    .map((loc) => loc.rating)
    .filter((value): value is number => typeof value === "number");
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 4.8;
  const averageRatingDisplay = averageRating.toFixed(1);
  const totalReviews = displayLocations.reduce(
    (sum, loc) => sum + (loc.reviewCount ?? 0),
    0
  );

  const handleOrderFromLocation = (locationId: string) => {
    // In a real app, this would set the selected location and redirect to menu
    console.log(`Starting order from location: ${locationId}`);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <XichuanHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Our Locations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience authentic Xi&apos;an cuisine at any of our locations.
            Each restaurant features master noodle pullers creating fresh,
            hand-pulled noodles daily.
          </p>
        </div>

        {usingApi && (
          <div className="mb-8 flex justify-center">
            <Badge variant="secondary" className="text-xs">
              Connected to CraveUp API
            </Badge>
          </div>
        )}

        {apiError && (!usingApi || !preferApi) && (
          <div className="mb-8 flex justify-center">
            <div className="rounded-md border border-amber-400 bg-amber-100 px-4 py-2 text-sm text-amber-800">
              {preferApi
                ? `Unable to reach the CraveUp API. Showing curated location details. (${apiError})`
                : apiError}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <ClientIcon
              name="Loader2"
              className="h-10 w-10 animate-spin text-muted-foreground"
            />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "hsl(var(--brand-accent))" }}
                  >
                    {locationCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Locations
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "hsl(var(--brand-accent))" }}
                  >
                    {totalReviews > 0
                      ? totalReviews.toLocaleString()
                      : "1,000+"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Guest Reviews
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "hsl(var(--brand-accent))" }}
                  >
                    {averageRatingDisplay}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {displayLocations.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-16">
                  Locations will appear here once they are available for this
                  restaurant.
                </div>
              )}
              {displayLocations.map((location) => {
                const ratingValue =
                  typeof location.rating === "number"
                    ? location.rating.toFixed(1)
                    : undefined;
                const reviewValue =
                  typeof location.reviewCount === "number"
                    ? location.reviewCount
                    : undefined;
                const methodBadges = location.methodsStatus
                  ? ([
                      location.methodsStatus.delivery && "Delivery",
                      location.methodsStatus.pickup && "Pickup",
                      location.methodsStatus.table && "Dine In",
                      location.methodsStatus.roomService && "Room Service",
                    ].filter(Boolean) as string[])
                  : undefined;
                const displayFeatures =
                  methodBadges && methodBadges.length > 0
                    ? methodBadges
                    : location.features ?? [];

                return (
                  <Card
                    key={location.id}
                    className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col gap-0 pt-0"
                  >
                    <div className="relative h-64 overflow-hidden rounded-t-xl">
                      <img
                        src={location.image ?? FALLBACK_LOCATION_IMAGE}
                        alt={location.name}
                        className="h-full w-full object-cover"
                      />
                      {location.isMainLocation && (
                        <Badge
                          className="absolute top-3 left-3 text-white"
                          style={{
                            backgroundColor: "hsl(var(--brand-accent))",
                          }}
                        >
                          Original Location
                        </Badge>
                      )}
                      {(usingApi || ratingValue) && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-sm text-white backdrop-blur-sm dark:bg-white/20 dark:text-foreground">
                          <ClientIcon
                            name="Star"
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                          {ratingValue ?? averageRatingDisplay}
                          {reviewValue ? ` (${reviewValue})` : ""}
                        </div>
                      )}
                    </div>

                    <CardHeader className="p-3">
                      <CardTitle className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">
                            {location.name}
                          </h3>
                          {location.neighborhood && (
                            <p className="text-sm font-normal text-muted-foreground">
                              {location.neighborhood}
                            </p>
                          )}
                        </div>
                      </CardTitle>
                      {location.bio && (
                        <p className="text-sm text-muted-foreground">
                          {location.bio}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4 px-3">
                      <div className="flex items-start gap-2">
                        <ClientIcon
                          name="MapPin"
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                        />
                        {location.address ? (
                          <a
                            href={getMapsUrl(location.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-left text-sm text-foreground transition-colors hover:text-primary hover:underline"
                          >
                            {location.address}
                          </a>
                        ) : (
                          <div className="text-sm text-foreground">
                            Address coming soon
                          </div>
                        )}
                      </div>

                      {location.phone && (
                        <div className="flex items-center gap-3">
                          <ClientIcon
                            name="Phone"
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                          />
                          <a
                            href={`tel:${location.phone}`}
                            className="text-sm text-foreground transition-colors hover:text-primary hover:underline"
                          >
                            {location.phone}
                          </a>
                        </div>
                      )}

                      {location.hours && (
                        <div className="flex items-start gap-3">
                          <ClientIcon
                            name="Clock"
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                          />
                          <div className="space-y-1 text-sm text-foreground">
                            {location.hours.weekdays && (
                              <div>Mon-Fri: {location.hours.weekdays}</div>
                            )}
                            {location.hours.saturday && (
                              <div>Saturday: {location.hours.saturday}</div>
                            )}
                            {location.hours.sunday && (
                              <div>Sunday: {location.hours.sunday}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {displayFeatures.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {displayFeatures.map((feature) => (
                            <Badge
                              key={feature}
                              variant="secondary"
                              className="shrink-0 whitespace-nowrap text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-2 text-sm">
                        {location.deliveryRadius && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Delivery Radius:
                            </span>
                            <span className="font-medium text-foreground">
                              {location.deliveryRadius}
                            </span>
                          </div>
                        )}
                        {typeof location.pickupAvailable === "boolean" && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Pickup Available:
                            </span>
                            <span className="font-medium text-foreground">
                              {location.pickupAvailable ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 text-white hover:opacity-90"
                          style={{
                            backgroundColor: "hsl(var(--brand-accent))",
                          }}
                          onClick={() => handleOrderFromLocation(location.id)}
                          disabled={location.orderingAvailable === false}
                        >
                          Order Now
                          <ClientIcon
                            name="ChevronRight"
                            className="ml-1 h-4 w-4"
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-accent hover:text-accent-foreground"
                          disabled={!location.address}
                          asChild={Boolean(location.address)}
                        >
                          {location.address ? (
                            <a
                              href={getMapsUrl(location.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Get directions"
                            >
                              <ClientIcon
                                name="Navigation"
                                className="h-4 w-4"
                              />
                            </a>
                          ) : (
                            <ClientIcon name="Navigation" className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Want Xichuan Noodles in Your Neighborhood?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;re expanding across NYC! Contact us if you&apos;d
                    like to see a Xichuan Noodles location near you or inquire
                    about catering services for your event.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">Contact Us</Button>
                    <Button
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                    >
                      Catering Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <XichuanFooter />
      <XichuanCart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}
