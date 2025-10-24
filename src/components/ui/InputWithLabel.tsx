import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define the props for InputWithLabel including ref forwarding
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  label?: string;
  helperText?: string;
  hasError?: boolean;
}

// Use forwardRef to pass the ref to the input
const InputWithLabel = forwardRef<HTMLInputElement, InputProps>(
  ({ helperText, label, hasError, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <Label htmlFor={props.id} className='mb-2.5 inline-block font-medium'>
            {label}
          </Label>
        )}
        <Input ref={ref} {...props} />
        {helperText && (
          <p
            className={cn(
              "mt-2 text-xs",
              hasError ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

// Set the display name for debugging purposes
InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
