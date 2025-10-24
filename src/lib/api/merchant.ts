import type { RequestConfig } from '@craveup/storefront-sdk';
import { storefrontClient } from '@/lib/storefront-client';

export function getMerchant(slug: string, config?: RequestConfig) {
  return storefrontClient.merchant.getBySlug(slug, config);
}
