"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

interface ItemCounterButtonProps {
  value: number;
  onIncrease: (event: MouseEvent<HTMLButtonElement>) => void;
  onDecrease: (event: MouseEvent<HTMLButtonElement>) => void;
  small?: boolean;
  disabled?: boolean;
  minValue?: number;
  maxValue?: number;
}

const ItemCounterButton = ({
  value,
  onIncrease,
  onDecrease,
  small = false,
  disabled = false,
  minValue = 0,
  maxValue,
}: ItemCounterButtonProps) => {
  const atMin = value <= minValue;
  const atMax = typeof maxValue === "number" ? value >= maxValue : false;

  return (
    <div
      className={cn(
        "flex items-center",
        small ? "space-x-1.5" : "space-x-2.5"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={disabled || atMin}
        aria-label="Decrease quantity"
        className={cn(small && "h-7 w-7")}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div
        className="w-8 text-center font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrease}
        disabled={disabled || atMax}
        aria-label="Increase quantity"
        className={cn(small && "h-7 w-7")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ItemCounterButton;
