import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export enum ItemUnavailableActions {
  REMOVE_ITEM = "remove_item",
  CANCEL_ENTIRE_ORDER = "cancel_entire_order",
}

interface ItemUnavailableActionProps {
  itemUnavailableAction: ItemUnavailableActions;
  setItemUnavailableAction: (
    itemUnavailableAction: ItemUnavailableActions,
  ) => void;
  disabled?: boolean;
}

function ItemUnavailableAction(props: ItemUnavailableActionProps) {
  return (
    <div className='mx-2 my-4'>
      <p className='mb-3 text-base font-semibold'>If Item is Unavailable…</p>
      <RadioGroup
        disabled={props.disabled}
        value={props.itemUnavailableAction}
        onValueChange={props.setItemUnavailableAction}
        className='space-y-2'
      >
        <div className='flex items-center gap-2'>
          <RadioGroupItem
            value={ItemUnavailableActions.REMOVE_ITEM}
            id={ItemUnavailableActions.REMOVE_ITEM}
          />
          <Label htmlFor={ItemUnavailableActions.REMOVE_ITEM}>
            Remove this item and continue my order
          </Label>
        </div>
        <div className='flex items-center gap-2'>
          <RadioGroupItem
            value={ItemUnavailableActions.CANCEL_ENTIRE_ORDER}
            id={ItemUnavailableActions.CANCEL_ENTIRE_ORDER}
          />
          <Label htmlFor={ItemUnavailableActions.CANCEL_ENTIRE_ORDER}>
            Cancel my entire order
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default ItemUnavailableAction;
