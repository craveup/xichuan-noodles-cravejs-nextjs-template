import type { RequestConfig } from '@craveup/storefront-sdk';
import { storefrontClient } from '@/lib/storefront-client';

export function getLocationById(locationId: string, config?: RequestConfig) {
  return storefrontClient.locations.getById(locationId, config);
}
