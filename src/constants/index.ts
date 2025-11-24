export const CRAVEUP_PUBLIC_API_KEY =
  process.env.NEXT_PUBLIC_CRAVEUP_API_KEY?.trim() ?? "";
export const location_Id = process.env.NEXT_PUBLIC_LOCATION_ID?.trim() ?? "";
export const ORGANIZATION_SLUG =
  process.env.NEXT_PUBLIC_ORG_SLUG?.trim() ?? "";
export const DEFAULT_FULFILLMENT_METHOD = "takeout";

export const imagePlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAE7AQMAAAA7IG32AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFysrKceY6JgAAAC5JREFUeJztwQENAAAAwqD3T20PBxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwI8BXYQAAeEOeqIAAAAASUVORK5CYII=";

export const SWR_CONFIG = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};
