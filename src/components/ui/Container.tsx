import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    variant: {
      // Keep legacy names for compatibility; simplify classes
      fullMobileConstrainedPadded: "max-w-7xl",
      constrainedPadded: "max-w-7xl",
      fullMobileBreakpointPadded: "container",
      breakpointPadded: "container",
      narrowConstrainedPadded: "max-w-3xl",
    },
  },
  defaultVariants: {
    variant: "fullMobileConstrainedPadded",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  asChild,
  className,
  children,
  variant,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  const containerClasses = cn(containerVariants({ variant }), className);

  return (
    <Comp className={containerClasses} {...props}>
      {children}
    </Comp>
  );
};

export { Container, containerVariants };
