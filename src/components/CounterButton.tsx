"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

interface CounterButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  showTrashAtOne?: boolean;
  className?: string;
}

const CounterButton = ({
  quantity,
  onDecrease,
  onIncrease,
  isLoading,
  disabled,
  showTrashAtOne = true,
  className,
}: CounterButtonProps) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 min-w-[120px] items-center justify-between rounded-full border border-border bg-muted/70 px-1",
        className,
      )}
    >
      <Button
        onClick={onDecrease}
        type="button"
        disabled={Boolean(isLoading) || Boolean(disabled)}
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full"
        aria-label={quantity === 1 && showTrashAtOne ? "Remove item" : "Decrease quantity"}
      >
        {quantity === 1 && showTrashAtOne ? <Trash2 /> : <Minus />}
      </Button>

      <div className="flex w-[44px] justify-center text-center">
        {isLoading ? <LoadingSpinner /> : <span className="text-sm font-semibold">{quantity}</span>}
      </div>

      <Button
        onClick={onIncrease}
        type="button"
        disabled={Boolean(isLoading) || Boolean(disabled)}
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default CounterButton;
