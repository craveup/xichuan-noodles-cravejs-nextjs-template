"use client";

import React, {useEffect, useMemo, useState} from "react";
import {ItemUnavailableActions} from "@/contracts";
import {useOrderInfoStore} from "@/app/[locationId]/store/orderInfo-store";
import {useApiResource} from "@/hooks/useApiResource";
import type {ProductDescription, SelectedModifierTypes} from "@/types/menu-types";
import ErrorMessage from "../ErrorMessage";
import {Button} from "../ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import ItemUnavailableAction from "@/components/product-description/ItemUnavailableAction";
import SpecialInstructions from "@/components/product-description/SpecialInstructions";
import ModifierGroup from "@/components/product-description/ModifierGroup";

export type ItemFormData = {
    quantity: number;
    specialInstructions: string;
    itemUnavailableAction: ItemUnavailableActions;
    selections: SelectedModifierTypes[];
};

interface ProductDescriptionScreenProps {
    productId: string;
    isBlocked?: boolean;
    handleAddToCart: (data: ItemFormData) => Promise<void>;
    modifierErrorGroupId?: string;
    onModifierGroupInteract?: (groupId?: string) => void;
}

const SKELETON_PLACEHOLDERS = Array.from({length: 6});


export function ProductDescriptionScreen(
    {
        productId,
        isBlocked,
        handleAddToCart,
        modifierErrorGroupId,
        onModifierGroupInteract,
    }: ProductDescriptionScreenProps) {
    const {locationId} = useOrderInfoStore();
    const [selections, setSelections] = useState<SelectedModifierTypes[]>([]);
    const [itemUnavailableAction, setItemUnavailableAction] = useState<ItemUnavailableActions>(
        ItemUnavailableActions.REMOVE_ITEM,
    );
    const [specialInstructions, setSpecialInstructions] = useState("");

    const {
        data: product,
        error,
        isLoading,
        mutate,
    } = useApiResource<ProductDescription>(
        locationId ? `/api/v1/locations/${locationId}/products/${productId}` : null,
    );

    const modifiers = useMemo(() => product?.modifiers ?? [], [product]);

    useEffect(() => {
        if (!modifierErrorGroupId) return;
        const element = document.getElementById(modifierErrorGroupId);
        element?.scrollIntoView({behavior: "smooth", block: "start"});
    }, [modifierErrorGroupId]);

    if (isLoading || !product) {
        return (
            <div className='my-4 space-y-2'>
                {SKELETON_PLACEHOLDERS.map((_, index) => (
                    <Skeleton key={index} className='h-4 w-full'/>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex h-full w-full flex-col items-center justify-center space-y-4'>
                <ErrorMessage message='Failed to load data. Please try again later.'/>
                <Button onClick={() => mutate()} className='w-40 rounded-full'>
                    Retry
                </Button>
            </div>
        );
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload: ItemFormData = {
            quantity: 1,
            specialInstructions,
            itemUnavailableAction,
            selections,
        };

        await handleAddToCart(payload);
    };

    return (
        <form onSubmit={handleSubmit} id='product-description-form'>
            <ItemUnavailableAction
                itemUnavailableAction={itemUnavailableAction}
                setItemUnavailableAction={setItemUnavailableAction}
                disabled={isBlocked}
            />

            <SpecialInstructions
                specialInstructions={specialInstructions}
                setSpecialInstructions={setSpecialInstructions}
                disabled={isBlocked}
            />

            {modifiers.length > 0 && (
                <div className='mt-4'>
                    <ModifierGroup
                        modifiers={modifiers}
                        selections={selections}
                        setSelections={setSelections}
                        disabled={isBlocked}
                        errorModifierGroupId={modifierErrorGroupId}
                        onGroupInteract={onModifierGroupInteract}
                    />
                </div>
            )}
        </form>
    );
}
