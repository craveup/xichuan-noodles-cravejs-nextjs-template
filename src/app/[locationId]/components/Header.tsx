// app/[locationId]/components/Header.tsx
import React from "react";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { cn } from "@/lib/utils";
import ShowMoreText from "@/app/[locationId]/components/ShowMoreText";
import { GetLocationViaSlugType } from "@/types/location-types";

const Header = ({ location }: { location: GetLocationViaSlugType }) => {
  const { restaurantDisplayName, restaurantBio, restaurantLogo, coverPhoto } =
    location;

  const hasCover = Boolean(coverPhoto && coverPhoto.trim());
  const hasLogo = Boolean(restaurantLogo && restaurantLogo.trim());

  const coverStyles = hasCover
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(12, 12, 12, 0.35), rgba(12, 12, 12, 0.05)), url(${coverPhoto})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }
    : undefined;

  return (
    <header aria-label={`${restaurantDisplayName} hero`}>
      <Container className='px-0 sm:px-6 lg:px-8'>
        <div
          className={cn(
            "relative h-[200px] w-full overflow-visible sm:h-[280px] md:h-[320px]",
            "border-border/60 bg-muted rounded-b-3xl border",
            "shadow-sm",
          )}
          style={coverStyles}
        >
          {(hasLogo || restaurantDisplayName) && (
            <div
              className={cn(
                "absolute -bottom-8 left-4 flex h-[80px] w-[80px] items-center justify-center",
                "border-border bg-background/95 overflow-hidden rounded-2xl border p-1.5",
                "supports-[backdrop-filter]:bg-background/75 shadow-lg backdrop-blur",
              )}
            >
              <ImageWithFallback
                src={hasLogo ? restaurantLogo : undefined}
                alt={`${restaurantDisplayName} logo`}
                width={72}
                height={72}
                className='object-contain'
                sizes='80px'
                priority
              />
            </div>
          )}
        </div>
      </Container>

      <Container className='px-4 sm:px-6 lg:px-8'>
        <div className='space-y-3 pb-6'>
          <h1
            className={cn(
              "text-foreground font-semibold tracking-tight",
              "pt-10 text-2xl sm:text-3xl md:text-4xl",
            )}
          >
            {restaurantDisplayName}
          </h1>

          {restaurantBio?.trim() && (
            <div className='text-muted-foreground'>
              <ShowMoreText text={restaurantBio} />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
