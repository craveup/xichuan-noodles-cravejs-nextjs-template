import type { StartOrderingSessionRequest, StartOrderingSessionResponse, RequestConfig } from '@craveup/storefront-sdk';
import { storefrontClient } from '@/lib/storefront-client';

export function startOrderingSession(
  locationId: string,
  payload: StartOrderingSessionRequest,
  config?: RequestConfig
): Promise<StartOrderingSessionResponse> {
  return storefrontClient.orderingSessions.start(locationId, payload, config);
}
