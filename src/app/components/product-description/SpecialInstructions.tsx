"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(specialInstructions);

  useEffect(() => {
    if (!isOpen) {
      setDraft(specialInstructions);
    }
  }, [isOpen, specialInstructions]);

  const remaining = useMemo(() => maxLength - draft.length, [draft, maxLength]);
  const overLimit = remaining < 0;
  const unchanged = draft.trim() === (specialInstructions ?? "").trim();
  const canSave = !disabled && !overLimit && !unchanged;

  const handleOpen = () => {
    if (disabled) return;
    setDraft(specialInstructions);
    setIsOpen(true);
  };

  const handleClose = () => {
    setDraft(specialInstructions);
    setIsOpen(false);
  };

  const handleSave = (event?: React.FormEvent | React.MouseEvent) => {
    event?.preventDefault?.();
    if (!canSave) return;
    setSpecialInstructions(draft.trim());
    setIsOpen(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (canSave) {
        setSpecialInstructions(draft.trim());
        setIsOpen(false);
      }
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className="my-4 flex w-full items-center justify-between px-4 text-left transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        <p className="text-xl font-semibold">Special Instructions</p>
        <Plus size={20} />
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) {
            handleClose();
          }
        }}
      >
        <DialogContent
          className="z-1101 max-h-[85vh] max-w-[90vw] overflow-hidden rounded-lg p-0 sm:max-w-lg"
          overlayClassName="z-[1100] bg-black/60"
        >
          <form
            onSubmit={handleSave}
            className="flex h-full flex-col"
            id="special-instructions-form"
          >
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-lg font-semibold">
                Enter special instructions
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Let the kitchen know about allergies or special requests.
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-2 scrollbar-hide">
              <Textarea
                placeholder="Add any notes for the kitchen"
                value={draft}
                rows={6}
                maxLength={maxLength}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="min-h-40"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{Math.max(0, remaining)} characters left</span>
                {overLimit && (
                  <span className="text-destructive">Too long</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                variant="outline"
                onClick={handleClose}
                type="button"
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSave}>
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialInstructions;
