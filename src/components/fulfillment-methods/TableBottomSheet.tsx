import { useState } from "react";
import InputWithLabel from "@/components/ui/InputWithLabel";

interface TableBottomSheetProps {
  handleSubmit: (newTableNumber: string) => void;
  tableNumber?: string;
}

const TableBottomSheet = ({
  handleSubmit,
  tableNumber = "",
}: TableBottomSheetProps) => {
  const [newTableNumber, setNewTableNumber] = useState(tableNumber);

  return (
      <form id='table-number-modal' onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(newTableNumber);
      }}>
        <InputWithLabel
          label='Table number'
          min='1'
          value={newTableNumber}
          type='number'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTableNumber(e.target.value)}
        />
      </form>
  );
};

export default TableBottomSheet;
