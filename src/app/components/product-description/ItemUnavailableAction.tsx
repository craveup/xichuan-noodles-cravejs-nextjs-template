"use client";

import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { ItemUnavailableActions } from "@craveup/storefront-sdk";

interface ItemUnavailableActionProps {
  itemUnavailableAction: ItemUnavailableActions;
  setItemUnavailableAction: (
    action: ItemUnavailableActions
  ) => void;
  disabled?: boolean;
}

const ItemUnavailableAction = ({
  itemUnavailableAction,
  setItemUnavailableAction,
  disabled,
}: ItemUnavailableActionProps) => {
  return (
    <div className="space-y-3 rounded-lg border border-muted p-4">
      <p className="text-sm font-semibold">
        If the item is unavailable...
      </p>
      <RadioGroup
        disabled={disabled}
        value={itemUnavailableAction}
        onValueChange={(value) =>
          setItemUnavailableAction(value as ItemUnavailableActions)
        }
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value={ItemUnavailableActions.REMOVE_ITEM}
            id="remove-item"
          />
          <Label htmlFor="remove-item" className="font-normal">
            Remove item from my order
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value={ItemUnavailableActions.CANCEL_ENTIRE_ORDER}
            id="cancel-order"
          />
          <Label htmlFor="cancel-order" className="font-normal">
            Cancel entire order
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ItemUnavailableAction;
