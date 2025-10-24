import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "@/constants";

const containerStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: "none",
  styles: [
    {
      // Simplify the map style
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      // Customize the road appearance
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }, { weight: 1 }],
    },
    {
      // Customize land color
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      // Customize water appearance
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }],
    },
    {
      // Hide all administrative elements
      featureType: "administrative",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      // Hide points of interest
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      // Hide transit elements
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Custom marker icon
const markerIcon = {
  path: 0.0,
  fillColor: "#FF5722", // Orange color for visibility
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: "#FFFFFF",
  scale: 8,
};

function MapView({ position }: { position: { lat: number; lng: number } }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const onLoad = React.useCallback(
    (map: google.maps.Map) => {
      // Set appropriate zoom level and center
      map.setZoom(15); // Closer zoom for better visibility
      map.setCenter(position);
    },
    [position],
  );

  if (!isLoaded) {
    return <div style={containerStyle} className='animate-pulse bg-muted' />;
  }

  return (
    <div className='relative overflow-hidden rounded-lg'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        onLoad={onLoad}
        options={mapOptions}
      >
        <Marker
          position={position}
          icon={markerIcon}
          animation={google.maps.Animation.DROP}
        />
      </GoogleMap>
      {/* Optional: Add a subtle overlay to further minimize Google elements */}
      <div className='absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background/50 to-transparent' />
    </div>
  );
}

export default React.memo(MapView);
