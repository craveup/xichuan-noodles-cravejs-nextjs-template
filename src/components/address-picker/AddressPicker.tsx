// src/components/fulfilment-methods/DeliveryAddressForm.tsx
"use client";
import {useEffect, useMemo, useRef} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {useJsApiLoader} from "@react-google-maps/api";
import {zodResolver} from "@hookform/resolvers/zod";
import AddressAutocomplete from "@/components/address-picker/AddressAutocomplete";
import MapPicker from "@/components/address-picker/MapPicker";
import {Input} from "@/components/ui/input";

export const addressAutoCompleteSchema = z.object({
    street: z.string().min(2, "Street is required"),
    streetOptional: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(1, "State/Region is required"),
    zipCode: z.string().min(3, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
});

export type AddressAutoCompleteType = z.infer<typeof addressAutoCompleteSchema>;

export interface DefaultAddress {
    street: string;
    streetOptional?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    lat: number;
    lng: number;
}

type Props = {
    defaultAddress?: DefaultAddress;
    onAddressSubmit: (address: DefaultAddress) => void;
};

const DEFAULT_CENTER = {lat: 37.7749, lng: -122.4194};

export default function AddressPicker(
    {
        defaultAddress,
        onAddressSubmit,
    }: Props) {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    useEffect(() => {
        if (isLoaded && !geocoderRef.current) {
            geocoderRef.current = new google.maps.Geocoder();
        }
    }, [isLoaded]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<AddressAutoCompleteType>({
        resolver: zodResolver(addressAutoCompleteSchema),
        defaultValues: {
            street: defaultAddress?.street ?? "",
            streetOptional: defaultAddress?.streetOptional ?? "",
            city: defaultAddress?.city ?? "",
            state: defaultAddress?.state ?? "",
            zipCode: defaultAddress?.zipCode ?? "",
            country: defaultAddress?.country ?? "",
            lat: defaultAddress?.lat ?? null,
            lng: defaultAddress?.lng ?? null,
        },
        mode: "onChange",
    });

    const lat = watch("lat");
    const lng = watch("lng");

    // try auto-geolocate initially if nothing set
    useEffect(() => {
        if (!isLoaded || lat || lng || !navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue("lat", pos.coords.latitude);
                setValue("lng", pos.coords.longitude);
                reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
            },
            {enableHighAccuracy: true, timeout: 8000}
        );
    }, [isLoaded, lat, lng, setValue]);

    const center = useMemo(() => {
        if (lat && lng) return {lat, lng};
        return DEFAULT_CENTER;
    }, [lat, lng]);

    const reverseGeocode = (la: number, ln: number) => {
        if (!geocoderRef.current) return;
        geocoderRef.current.geocode({location: {lat: la, lng: ln}}, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const r = results[0];
                // parse components
                let streetNumber = "", route = "", city = "", state = "", postal = "", country = "";
                r.address_components?.forEach((c) => {
                    if (c.types.includes("street_number")) streetNumber = c.long_name;
                    if (c.types.includes("route")) route = c.long_name;
                    if (c.types.includes("locality")) city = c.long_name;
                    if (c.types.includes("administrative_area_level_1")) state = c.short_name;
                    if (c.types.includes("postal_code")) postal = c.long_name;
                    if (c.types.includes("country")) country = c.long_name;
                });
                setValue("street", `${streetNumber} ${route}`.trim());
                setValue("city", city);
                setValue("state", state);
                setValue("zipCode", postal);
                setValue("country", country);
            }
        });
    };
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue("lat", pos.coords.latitude);
                setValue("lng", pos.coords.longitude);
                reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                toast.success("Current location captured");
            },
            () => toast.error("Unable to fetch current location"),
            {enableHighAccuracy: true, timeout: 8000}
        );
    };

    const onPlaceResolved = (p: DefaultAddress) => {
        setValue("street", p.street);
        setValue("city", p.city);
        setValue("state", p.state);
        setValue("zipCode", p.zipCode);
        setValue("country", p.country);
        setValue("lat", p.lat);
        setValue("lng", p.lng);
    };

    const onMapChange = (c: { lat: number; lng: number }) => {
        setValue("lat", c.lat, {shouldDirty: true});
        setValue("lng", c.lng, {shouldDirty: true});
        reverseGeocode(c.lat, c.lng);
    };

    const countryIso2 = 'us';

    if(!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <form id="delivery-address-form" onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
            {/* Map with draggable marker */}
            <MapPicker value={center} onChange={onMapChange}/>

            {/* Street (autocomplete) */}
            <AddressAutocomplete
                control={control}
                name="street"
                label="Street Address"
                placeholder="Enter your address"
                disabled={!isLoaded}
                countryIso2={countryIso2}
                onPlaceResolved={(p) => {
                    onPlaceResolved({
                        ...p,
                        street: p.street,
                        lat: p.lat,
                        lng: p.lng,
                    })
                }}
            />

            {/* Street 2 */}
            <div className="space-y-1">
                <label htmlFor="streetOptional" className="text-sm font-medium">Apt / Suite (optional)</label>
                <Input id="streetOptional" placeholder="Apt, suite, etc." {...register("streetOptional")} />
                {errors.streetOptional?.message && (
                    <p className="text-xs text-destructive">{errors.streetOptional.message}</p>
                )}
            </div>

            {/* City / State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <Input id="city" {...register("city")} />
                    {errors.city?.message && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-1">
                    <label htmlFor="state" className="text-sm font-medium">State / Region</label>
                    <Input id="state" {...register("state")} />
                    {errors.state?.message && <p className="text-xs text-destructive">{errors.state.message}</p>}
                </div>
            </div>

            {/* Postal / Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="zipCode" className="text-sm font-medium">Postal code</label>
                    <Input id="zipCode" {...register("zipCode")} />
                    {errors.zipCode?.message && <p className="text-xs text-destructive">{errors.zipCode.message}</p>}
                </div>
                <div className="space-y-1">
                    <label htmlFor="country" className="text-sm font-medium">Country</label>
                    <Input id="country" {...register("country")} />
                    {errors.country?.message && <p className="text-xs text-destructive">{errors.country.message}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
                    Use current location
                </Button>
                {lat && lng && (
                    <span className="text-xs text-muted-foreground">
            lat: {lat.toFixed(5)}, lng: {lng.toFixed(5)}
          </span>
                )}
            </div>

            {/* Hidden button lets dialog confirm (formId) trigger submit, but still supports Enter key */}
            <button type="submit" hidden disabled={isSubmitting}/>
        </form>
    );
}
