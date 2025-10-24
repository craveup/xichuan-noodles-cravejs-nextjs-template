const fallbackApiBase =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_CRAVEUP_STOREFRONT_BASE_URL ?? "";

export const STORE_FRONT_API_BASE_URL = fallbackApiBase;
export const ADMIN_API_BASE_URL = fallbackApiBase;
export const GOOGLE_MAP_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
export const imagePlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAE7AQMAAAA7IG32AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFysrKceY6JgAAAC5JREFUeJztwQENAAAAwqD3T20PBxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwI8BXYQAAeEOeqIAAAAASUVORK5CYII=";

export const SWR_CONFIG = {
  revalidateIfStale: true, // Disable revalidation if data is fresh
  revalidateOnFocus: false, // Disable revalidation when window is focused
  revalidateOnReconnect: false, // Disable revalidation when reconnecting
  keepPreviousData: true, // Prevents flickering on fast navigation
};

// Checkout UX
