// components/fulfillment-methods/FulfilmentMethodHandler.tsx
import React from "react";
import { FulfilmentMethods } from "@/contracts";
import DeliveryFulfillment from "./DeliveryFulfillment";
import TableSideFulfillment from "./TableSideFulfillment";
import TakeoutFulfillment from "./TakeoutFulfillment";
import SelectRoomNumber from "@/components/fulfillment-methods/SelectRoomNumber";

type Props = {
  fulfilmentMethod: string;
};

const FulfilmentMethodHandler = ({ fulfilmentMethod }: Props) => {
  switch (fulfilmentMethod) {
    case FulfilmentMethods.TAKEOUT:
      return <TakeoutFulfillment />;
    case FulfilmentMethods.TABLE_SIDE:
      return <TableSideFulfillment />;
    case FulfilmentMethods.DELIVERY:
      return <DeliveryFulfillment />;
    case FulfilmentMethods.ROOM_SERVICE:
      return <SelectRoomNumber />;
    default:
      return null;
  }
};

export default FulfilmentMethodHandler;
