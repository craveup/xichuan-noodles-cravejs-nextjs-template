"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveDialogProps {
  title?: string;
  description?: string;
  rightText?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onMainBtnClick?: () => void;
  formId?: string;
  loading?: boolean;
  children?: React.ReactNode;
  hideMainBtn?: boolean;
  hideCloseBtn?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  footer?: React.ReactNode;
}

export function ResponsiveDialog(props: ResponsiveDialogProps) {
  const {
    title,
    description,
    rightText,
    open,
    setOpen,
    onMainBtnClick,
    loading,
    children,
    hideMainBtn,
    hideCloseBtn,
    formId,
    submitLabel = "Submit",
    cancelLabel = "Cancel",
    footer,
  } = props;

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const shouldRenderHeader = title || description;
  const hideFooter = hideMainBtn && hideCloseBtn;

  const defaultFooter = hideFooter ? null : (
    <div
      className={cn("flex", isDesktop ? "space-x-2.5" : "flex-col space-y-2.5")}
    >
      {!hideCloseBtn && (
        <Button
          disabled={loading}
          onClick={() => setOpen(false)}
          className='flex-1'
          variant='outline'
        >
          {cancelLabel}
        </Button>
      )}
      {!hideMainBtn && (
        <LoadingButton
          loading={loading}
          disabled={loading}
          form={formId}
          type={onMainBtnClick ? "button" : "submit"}
          onClick={onMainBtnClick}
          className='flex-1'
        >
          {submitLabel}
        </LoadingButton>
      )}
    </div>
  );

  const footerContent = footer ?? defaultFooter;
  const bodyClasses = isDesktop ? "pb-6 pt-2" : "px-4 pb-6 pt-2";
  const bodyContent = (
    <div className={cn("flex-1 overflow-y-auto", bodyClasses)}>{children}</div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[85vh] flex flex-col overflow-hidden'>
          {shouldRenderHeader && (
            <DialogHeader className='mt-3 shrink-0 text-left'>
              {title && (
                <DialogTitle className='flex justify-between'>
                  <span>{title}</span>

                  {rightText && <span>{rightText}</span>}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {bodyContent}

          {footerContent && <DialogFooter className='shrink-0'>{footerContent}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='flex max-h-[100svh] flex-col overflow-hidden'>
        {shouldRenderHeader && (
          <DrawerHeader className='!text-left shrink-0'>
            {title && (
              <DrawerTitle className='flex justify-between'>
                <span>{title}</span>

                {rightText && <span>{rightText}</span>}
              </DrawerTitle>
            )}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}

        {bodyContent}

        {footerContent && (
          <DrawerFooter className='shrink-0 pt-2'>
            {footer ? (
              footerContent
            ) : (
              <DrawerClose asChild>{footerContent}</DrawerClose>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
