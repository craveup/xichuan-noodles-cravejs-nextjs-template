// src/components/maps/MapPicker.tsx
"use client";

/* global google */
import { useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

type Coords = { lat: number; lng: number };

type Props = {
    value: Coords;
    onChange: (coords: Coords) => void;
    zoom?: number;
    height?: number;
};

export default function MapPicker({ value, onChange, zoom = 14, height = 240 }: Props) {
    const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat == null || lng == null) return;
        onChange({ lat, lng });
    }, [onChange]);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat == null || lng == null) return;
        onChange({ lat, lng });
    }, [onChange]);

    // if (!isLoaded) return <div className="w-full" style={{ height }} />;

    return (
        <div className="w-full rounded-md overflow-hidden" style={{ height }}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={value}
                zoom={zoom}
                onClick={onMapClick}
            >
                <Marker position={value} draggable onDragEnd={onMarkerDragEnd} />
            </GoogleMap>
        </div>
    );
}
