"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XichuanHeader } from "../components/xichuan-header";
import { XichuanCart } from "../components/xichuan-cart";
import { XichuanFooter } from "../components/xichuan-footer";
import { ClientIcon } from "../components/client-icon";
import { useCart } from "../providers/cart-provider";

interface Location {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  reviewCount: number;
  features: string[];
  image: string;
  isMainLocation?: boolean;
  orderingAvailable: boolean;
  deliveryRadius: string;
  pickupAvailable: boolean;
}

const locations: Location[] = [
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
    image: "/images/xichuan-noodles/locations/chinatown-storefront.webp",
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
    image: "/images/xichuan-noodles/locations/flushing-storefront.webp",
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
    image: "/images/xichuan-noodles/locations/east-village-storefront.webp",
    orderingAvailable: true,
    deliveryRadius: "2 miles",
    pickupAvailable: true,
  },
];

export default function XichuanLocationsPage() {
  const { isCartOpen, closeCart } = useCart();
  // const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleOrderFromLocation = (locationId: string) => {
    // In a real app, this would set the selected location and redirect to menu
    console.log(`Starting order from location: ${locationId}`);
    window.location.href = "/";
  };

  const handleGetDirections = (address: string) => {
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
            Experience authentic Xi&apos;an cuisine at any of our locations. Each
            restaurant features master noodle pullers creating fresh,
            hand-pulled noodles daily.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "hsl(var(--brand-accent))" }}
              >
                3
              </div>
              <div className="text-sm text-muted-foreground">NYC Locations</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "hsl(var(--brand-accent))" }}
              >
                1000+
              </div>
              <div className="text-sm text-muted-foreground">
                Bowls Served Daily
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "hsl(var(--brand-accent))" }}
              >
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Hand-Pulled Fresh
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {locations.map((location) => (
            <Card
              key={location.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Location Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                {location.isMainLocation && (
                  <Badge
                    className="absolute top-3 left-3 text-white"
                    style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                  >
                    Original Location
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-black/70 dark:bg-white/20 text-white dark:text-foreground px-2 py-1 rounded text-sm flex items-center gap-1 backdrop-blur-sm">
                  <ClientIcon
                    name="Star"
                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                  />
                  {location.rating} ({location.reviewCount})
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {location.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {location.neighborhood}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <ClientIcon
                    name="MapPin"
                    className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      {location.address}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      style={{ color: "hsl(var(--brand-accent))" }}
                      onClick={() => handleGetDirections(location.address)}
                    >
                      Get Directions{" "}
                      <ClientIcon name="Navigation" className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <ClientIcon
                    name="Phone"
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                  />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-sm hover:underline text-foreground hover:text-primary transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <ClientIcon
                    name="Clock"
                    className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0"
                  />
                  <div className="text-sm space-y-1 text-foreground">
                    <div>Mon-Fri: {location.hours.weekdays}</div>
                    <div>Saturday: {location.hours.saturday}</div>
                    <div>Sunday: {location.hours.sunday}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {location.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs whitespace-nowrap flex-shrink-0"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Separator />

                {/* Ordering Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery Radius:
                    </span>
                    <span className="font-medium text-foreground">
                      {location.deliveryRadius}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Pickup Available:
                    </span>
                    <span className="font-medium text-foreground">
                      {location.pickupAvailable ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 text-white hover:opacity-90"
                    style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                    onClick={() => handleOrderFromLocation(location.id)}
                    disabled={!location.orderingAvailable}
                  >
                    Order Now
                    <ClientIcon name="ChevronRight" className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleGetDirections(location.address)}
                  >
                    <ClientIcon name="Navigation" className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Want Xichuan Noodles in Your Neighborhood?
              </h3>
              <p className="text-muted-foreground mb-6">
                We&apos;re expanding across NYC! Contact us if you&apos;d like to see a
                Xichuan Noodles location near you or inquire about catering
                services for your event.
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
      </div>

      <XichuanFooter />
      <XichuanCart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}
