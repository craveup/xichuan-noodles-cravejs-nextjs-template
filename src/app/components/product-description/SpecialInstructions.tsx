"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface SpecialInstructionsProps {
  specialInstructions: string;
  setSpecialInstructions: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

const SpecialInstructions = ({
  specialInstructions,
  setSpecialInstructions,
  disabled = false,
  maxLength = 240,
}: SpecialInstructionsProps) => {
  const [value, setValue] = useState(specialInstructions);

  useEffect(() => {
    setValue(specialInstructions);
  }, [specialInstructions]);

  const remaining = maxLength - value.length;
  const overLimit = remaining < 0;

  const handleSave = () => {
    if (!overLimit) {
      setSpecialInstructions(value.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Special instructions</p>
        <span className="text-xs text-muted-foreground">
          {Math.max(0, remaining)} characters left
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add any notes for the kitchen"
        maxLength={maxLength}
        disabled={disabled}
        rows={4}
      />
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="text-xs text-muted-foreground underline"
          onClick={() => setValue("")}
          disabled={disabled}
        >
          Clear
        </button>
        <button
          type="button"
          className="text-xs font-semibold text-primary"
          onClick={handleSave}
          disabled={disabled || overLimit}
        >
          Save
        </button>
      </div>
      {overLimit && (
        <p className="text-xs text-destructive">
          Please shorten your instructions.
        </p>
      )}
    </div>
  );
};

export default SpecialInstructions;
