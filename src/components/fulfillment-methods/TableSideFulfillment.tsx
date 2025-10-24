import { useState } from "react";
import { toast } from "sonner";
import TableBottomSheet from "@/components/fulfillment-methods/TableBottomSheet";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { setTable } from "@/lib/api";
import useDisclosure from "@/hooks/use-disclosure";
import { useCart } from "@/hooks/useCart";

const TableSideFulfillment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen, setOpen } = useDisclosure();

  const { cart, mutate } = useCart();

  if (!cart) {
    return null;
  }

  const handleSubmit = async (newTableNumber: string) => {
    try {
      setIsLoading(true);
      await setTable(cart.locationId, cart.id, newTableNumber);
      await mutate();
      setIsLoading(false);
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='mb-4 text-base font-semibold'>Table number</p>
          <span className='text-base'>{cart?.fulfillmentIdentifier}</span>
        </div>

        <Button size='lg' variant='secondary' onClick={onOpen}>
          Set
        </Button>
      </div>

      <ResponsiveDialog
        open={isOpen}
        setOpen={setOpen}
        title='Enter Table Number'
        formId='table-number-modal'
        submitLabel='Confirm'
        loading={isLoading}
      >
        <TableBottomSheet
          tableNumber={cart?.tableServiceInfo?.tableNumber}
          handleSubmit={handleSubmit}
        />
      </ResponsiveDialog>
    </>
  );
};

export default TableSideFulfillment;
