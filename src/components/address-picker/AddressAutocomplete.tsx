// src/components/maps/AddressAutocomplete.tsx
"use client";

import React, {useRef} from "react";
import {Controller, Control} from "react-hook-form";
import {Autocomplete} from "@react-google-maps/api";
import {Input} from "@/components/ui/input";
import {AddressAutoCompleteType, DefaultAddress} from "@/components/address-picker/AddressPicker";

type AddressAutocompleteProps = {
    control: Control<AddressAutoCompleteType>;
    name: keyof AddressAutoCompleteType;     // usually "street"
    label?: string;
    placeholder?: string;
    countryIso2?: string;             // normalized ISO2 (e.g., "us")
    disabled?: boolean;
    onPlaceResolved: (data: DefaultAddress) => void;
};

export default function AddressAutocomplete(
    {
        control,
        name,
        label = "Street Address",
        placeholder = "Start typing your address…",
        countryIso2,
        onPlaceResolved,
        disabled,
    }: AddressAutocompleteProps) {
    const acRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onPlaceChanged = () => {
        const ac = acRef.current;
        if (!ac) return;
        const place = ac.getPlace();
        if (!place || !place.geometry) return;

        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        if (lat == null || lng == null) return;

        // parse components
        let streetNumber = "", route = "", city = "", state = "", postal = "", country = "";
        place.address_components?.forEach((c) => {
            if (c.types.includes("street_number")) streetNumber = c.long_name;
            if (c.types.includes("route")) route = c.long_name;
            if (c.types.includes("locality")) city = c.long_name;
            if (c.types.includes("administrative_area_level_1")) state = c.short_name;
            if (c.types.includes("postal_code")) postal = c.long_name;
            if (c.types.includes("country")) country = c.long_name;
        });

        onPlaceResolved({
            street: `${streetNumber} ${route}`.trim(),
            city,
            state,
            zipCode: postal,
            country,
            lat,
            lng,
        });
    };

    const options: google.maps.places.AutocompleteOptions = {
        fields: ["formatted_address", "geometry", "address_components"],
        ...(countryIso2 ? {componentRestrictions: {country: countryIso2}} : {}),
    };

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <div className="space-y-1">
                    {label && (
                        <label htmlFor="street" className="text-sm font-medium">{label}</label>
                    )}
                    <Autocomplete
                        onLoad={(ac) => (acRef.current = ac)}
                        onPlaceChanged={onPlaceChanged}
                        options={options}
                    >
                        <Input
                            id="street"
                            type="text"
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            disabled={disabled}
                        />
                    </Autocomplete>
                    {fieldState.error?.message && (
                        <p className="text-xs text-destructive">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
}
