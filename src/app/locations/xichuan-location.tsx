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

const fallbackLocations: Location[] = [
  {
    id: "chinatown",
    name: "Xichuan Noodles Chinatown",
    address: "88 Mott Street, New York, NY 10013",
    neighborhood: "Chinatown",
    phone: "(212) 555-8888",
    hours: {
      weekdays: "11:00 AM - 10:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "11:00 AM - 10:00 PM",
    },
    rating: 4.9,
    reviewCount: 567,
    features: [
      "Dine In",
      "Takeout",
      "Delivery",
      "Hand-Pulled Noodles",
      "Authentic Xi&apos;an Cuisine",
      "Late Night",
    ],
    image: FALLBACK_LOCATION_IMAGE,
    isMainLocation: true,
    orderingAvailable: true,
    deliveryRadius: "3 miles",
    pickupAvailable: true,
  },
  {
    id: "flushing",
    name: "Xichuan Noodles Flushing",
    address: "136-20 Roosevelt Ave, Flushing, NY 11354",
    neighborhood: "Flushing",
    phone: "(718) 555-1368",
    hours: {
      weekdays: "11:00 AM - 9:30 PM",
      saturday: "11:00 AM - 10:00 PM",
      sunday: "11:00 AM - 9:30 PM",
    },
    rating: 4.8,
    reviewCount: 423,
    features: ["Dine In", "Takeout", "Delivery", "Family Style", "Parking"],
    image: FALLBACK_LOCATION_IMAGE,
    orderingAvailable: true,
    deliveryRadius: "2.5 miles",
    pickupAvailable: true,
  },
  {
    id: "east-village",
    name: "Xichuan Noodles East Village",
    address: "23 St Marks Pl, New York, NY 10003",
    neighborhood: "East Village",
    phone: "(212) 555-2323",
    hours: {
      weekdays: "11:30 AM - 11:00 PM",
      saturday: "11:30 AM - 12:00 AM",
      sunday: "11:30 AM - 11:00 PM",
    },
    rating: 4.7,
    reviewCount: 312,
    features: [
      "Takeout",
      "Delivery",
      "Late Night",
      "Student Discount",
      "Quick Service",
    ],
    image: FALLBACK_LOCATION_IMAGE,
    orderingAvailable: true,
    deliveryRadius: "2 miles",
    pickupAvailable: true,
  },
];

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

  const fallbackMap = useMemo(() => {
    const map = new Map<string, Location>();
    fallbackLocations.forEach((loc) => map.set(loc.id, loc));
    return map;
  }, []);

  const merchantLocations = useMemo<Location[]>(() => {
    if (!merchantQuery.data) return [];

    return merchantQuery.data.locations.map((loc) => {
      const fallback = fallbackMap.get(loc.id);
      const methods = loc.methodsStatus ?? {};
      const methodFeatures = [
        methods.pickup && "Pickup",
        methods.delivery && "Delivery",
        methods.table && "Dine In",
        methods.roomService && "Room Service",
      ].filter(Boolean) as string[];

      const hasActiveMethod = Object.values(methods).some((value) => Boolean(value));
      const orderingAvailable = hasActiveMethod
        ? true
        : fallback?.orderingAvailable ?? false;

      return {
        id: loc.id,
        name: loc.restaurantDisplayName || fallback?.name || "Restaurant",
        address: loc.addressString ?? fallback?.address,
        neighborhood: fallback?.neighborhood,
        phone: fallback?.phone,
        hours: fallback?.hours,
        rating: fallback?.rating,
        reviewCount: fallback?.reviewCount,
        features: methodFeatures.length > 0 ? methodFeatures : fallback?.features,
        image: loc.coverPhoto || fallback?.image,
        logo: loc.restaurantLogo,
        bio: loc.restaurantBio ?? fallback?.bio,
        isMainLocation: fallback?.isMainLocation,
        orderingAvailable,
        deliveryRadius: fallback?.deliveryRadius,
        pickupAvailable: methods.pickup ?? fallback?.pickupAvailable,
        methodsStatus: methods,
      };
    });
  }, [fallbackMap, merchantQuery.data]);

  const usingApi = preferApi && merchantLocations.length > 0;
  const displayLocations = usingApi ? merchantLocations : fallbackLocations;
  const loading =
    preferApi && (locationQuery.isLoading || merchantQuery.isLoading);
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
    0,
  );

  const handleOrderFromLocation = (locationId: string) => {
    // In a real app, this would set the selected location and redirect to menu
    console.log(`Starting order from location: ${locationId}`);
    window.location.href = "/";
  };

  const handleGetDirections = (address?: string) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank");
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
              {displayLocations.map((location) => {
                const ratingValue =
                  typeof location.rating === "number"
                    ? location.rating.toFixed(1)
                    : averageRatingDisplay;
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
                    className="overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
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
                      {(usingApi || ratings.length > 0) && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-sm text-white backdrop-blur-sm dark:bg-white/20 dark:text-foreground">
                          <ClientIcon
                            name="Star"
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                          {ratingValue}
                          {reviewValue ? ` (${reviewValue})` : ""}
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
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

                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <ClientIcon
                          name="MapPin"
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
                        />
                        <div className="text-sm text-foreground">
                          {location.address ?? "Address coming soon"}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          style={{ color: "hsl(var(--brand-accent))" }}
                          onClick={() => handleGetDirections(location.address)}
                          disabled={!location.address}
                        >
                          Get Directions
                          <ClientIcon name="Navigation" className="ml-1 h-3 w-3" />
                        </Button>
                      </div>

                      {location.phone && (
                        <div className="flex items-center gap-3">
                          <ClientIcon
                            name="Phone"
                            className="h-4 w-4 flex-shrink-0 text-muted-foreground"
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
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
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
                              className="flex-shrink-0 whitespace-nowrap text-xs"
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
                          style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                          onClick={() => handleOrderFromLocation(location.id)}
                          disabled={location.orderingAvailable === false}
                        >
                          Order Now
                          <ClientIcon name="ChevronRight" className="ml-1 h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleGetDirections(location.address)}
                          disabled={!location.address}
                        >
                          <ClientIcon name="Navigation" className="h-4 w-4" />
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
                    We&apos;re expanding across NYC! Contact us if you&apos;d like
                    to see a Xichuan Noodles location near you or inquire about
                    catering services for your event.
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
