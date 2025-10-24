// components/fulfillment-methods/DeliveryFulfillment.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import useDisclosure from "@/hooks/use-disclosure";
import { useCart } from "@/hooks/useCart";
import AddressPicker, {DefaultAddress} from "@/components/address-picker/AddressPicker";
import {useState} from "react";
import { setDelivery } from "@/lib/api";
import {toast} from "sonner";
import type { LocationAddressDTO } from "@/contracts";

const DeliveryFulfillment = () => {
    const { cart, mutate } = useCart();
    const { isOpen, onOpen, onClose, setOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const label = cart?.deliveryInfo?.addressString?.trim() || "No address set";

    if(!cart) return null;

    const handleSubmit = async (deliveryAddress: DefaultAddress) => {
        try {
            setIsLoading(true);
            await setDelivery(
              cart.locationId,
              cart.id,
              deliveryAddress as unknown as LocationAddressDTO,
            );
            await mutate();
            setIsLoading(false);
            onClose();
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="mb-1 text-base font-semibold">Delivery address</p>
                    <span className="text-base line-clamp-1">{label}</span>
                </div>

                <Button size="lg" variant="secondary" onClick={onOpen}>
                    {cart?.deliveryInfo?.addressString ? "Change" : "Set"}
                </Button>
            </div>

            <ResponsiveDialog
                open={isOpen}
                setOpen={setOpen}
                title="Enter Delivery Address"
                formId="delivery-address-form"
                submitLabel="Confirm"
                loading={isLoading}
            >
                <AddressPicker onAddressSubmit={handleSubmit} />
            </ResponsiveDialog>
        </>
    );
};

export default DeliveryFulfillment;
