import { storefrontClient } from "@/lib/storefront-client";
import type {
  StartOrderingSessionRequest,
  StartOrderingSessionResponse,
} from "@craveup/storefront-sdk";

export type { StartOrderingSessionRequest, StartOrderingSessionResponse };

export function startOrderingSession(
  locationId: string,
  payload: StartOrderingSessionRequest,
): Promise<StartOrderingSessionResponse> {
  return storefrontClient.orderingSessions.start(locationId, payload);
}
