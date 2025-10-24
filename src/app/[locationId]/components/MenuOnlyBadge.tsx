import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import React from "react";
import {useOrderInfoStore} from "@/app/[locationId]/store/orderInfo-store";

function MenuOnlyBadge() {
    const {orderSessionError} = useOrderInfoStore();

    if (!orderSessionError) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        className='mb-6 rounded-full px-3 py-1 text-xs'
                        variant='destructive'
                    >
                        Menu Only
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs text-center'>
                    {orderSessionError}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default MenuOnlyBadge;
