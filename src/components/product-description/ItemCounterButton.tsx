import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ItemCounterButtonProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  small?: boolean;
  disabled?: boolean;
}

const ItemCounterButton: React.FC<ItemCounterButtonProps> = ({
  value,
  onIncrease,
  onDecrease,
  small = false,
  disabled = false,
}) => {
  return (
   <div className={cn("flex items-center", small ? "space-x-1" : "space-x-2.5")}>
  <Button type="button" variant="outline" size="icon" onClick={onDecrease} disabled={disabled || value <= 0} aria-label="Decrement" className={cn("rounded-full", small && "h-8 w-8")}>
    <Minus />
  </Button>
  <div className="text-base w-8 text-center font-semibold tabular-nums" aria-live="polite">
    {value}
  </div>
  <Button type="button" variant="outline" size="icon" onClick={onIncrease} disabled={disabled || value >= 50} aria-label="Increment" className={cn("rounded-full", small && "h-8 w-8")}>
    <Plus />
  </Button>
</div>
  );
};

export default ItemCounterButton;
