import React, {useState} from "react";
import InputWithLabel from "@/components/ui/InputWithLabel";
import { setRoom } from "@/lib/api";
import {useCart} from "@/hooks/useCart";
import {Button} from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import useDisclosure from "@/hooks/use-disclosure";
import {toast} from "sonner";

interface RoomServiceFormProps {
    handleSubmit: (newData: { lastName: string, roomNumber: string }) => void;
}

function RoomServiceForm({handleSubmit}: RoomServiceFormProps) {
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");

    return (
        <form id='select-room-number-modal' onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({lastName: name, roomNumber});
        }}>
            <InputWithLabel
                className='mb-4'
                label='Last Name'
                name='last_name'
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <InputWithLabel
                name='room_number'
                label='Room Number'
                value={roomNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomNumber(e.target.value)}
            />
        </form>
    );
}

const SelectRoomNumber = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onClose, onOpen, setOpen} = useDisclosure();

    const {cart, mutate} = useCart();
    if(!cart) return null;

    const handleSubmit = async (roomDetails: { lastName: string; roomNumber: string }) => {
        try {
            setIsLoading(true);
            await setRoom(cart.locationId, cart.id, roomDetails);
            await mutate();
            setIsLoading(false);
            onClose();
        }catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <>
            <div className='flex items-center justify-between gap-4'>
                <div>
                    <p className='mb-4 text-base font-semibold'>Room number</p>
                    <span className='text-base'>
                        {cart?.fulfillmentIdentifier}
                    </span>
                </div>

                <Button size="lg" variant="secondary" onClick={onOpen}>
                    Set
                </Button>
            </div>

            <ResponsiveDialog
                open={isOpen}
                setOpen={setOpen}
                title='Enter Room Details'
                formId='select-room-number-modal'
                submitLabel='Confirm'
                loading={isLoading}
            >
                <RoomServiceForm
                    handleSubmit={handleSubmit}
                />
            </ResponsiveDialog>
        </>
    );
};

export default SelectRoomNumber;
