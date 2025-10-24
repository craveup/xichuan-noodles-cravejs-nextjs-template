import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Textarea } from "@/components/ui/textarea";
import useDisclosure from "@/hooks/use-disclosure";

interface SpecialInstructionsProps {
  specialInstructions: string;
  setSpecialInstructions: (value: string) => void;
  disabled?: boolean;
}

const SpecialInstructions: React.FC<SpecialInstructionsProps> = ({
  specialInstructions,
  setSpecialInstructions,
  disabled,
}) => {
  const [draft, setDraft] = useState(specialInstructions);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!isOpen) {
      setDraft(specialInstructions);
    }
  }, [isOpen, specialInstructions]);

  const handleDialogChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpen();
    } else {
      setDraft(specialInstructions);
      onClose();
    }
  };

  const handleSave = () => {
    setSpecialInstructions(draft.trim());
    onClose();
  };

  return (
    <div>
      <button
        type='button'
        disabled={disabled}
        onClick={onOpen}
        className='my-4 w-full rounded-xl border px-2 py-3 text-left'
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1'>
            <p className='text-base font-semibold'>Special Instructions</p>
            <p className='text-muted-foreground mt-1 line-clamp-1 text-sm'>
              e.g. no onions, sauce on side
            </p>
          </div>
          <Plus size={18} className='mt-0.5 shrink-0 self-start' />
        </div>
      </button>

      <ResponsiveDialog
        title='Enter special instructions'
        open={isOpen}
        setOpen={handleDialogChange}
        submitLabel='Save'
        onMainBtnClick={handleSave}
      >
        <div className='flex h-full w-full flex-col gap-4'>
          <Textarea
            placeholder='Enter special instructions'
            value={draft}
            rows={5}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default SpecialInstructions;
