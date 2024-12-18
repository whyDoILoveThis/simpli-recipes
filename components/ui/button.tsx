import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 bg-black bg-opacity-15 rounded-full text-slate-900 dark:text-white border border-slate-700 bg-opacity-10 shadow hover:bg-opacity-25",
        destructive:
          "dark:bg-red-600 dark:bg-opacity-40 dark:text-red-300 dark:hover:bg-opacity-20 bg-red-700  rounded-full text-red-700 border border-red-500 bg-opacity-10 shadow hover:bg-opacity-25",
        blue: "dark:bg-blue-600 dark:bg-opacity-40 dark:text-blue-300 dark:hover:bg-opacity-20 bg-blue-700  rounded-full text-blue-700 border border-blue-500 bg-opacity-10 shadow hover:bg-opacity-25",

        green:
          "dark:bg-green-600 dark:bg-opacity-40 dark:text-green-300 dark:hover:bg-opacity-20 bg-green-700  rounded-full text-green-700 border border-green-500 bg-opacity-10 shadow hover:bg-opacity-25",
        pink: "dark:bg-pink-600 dark:bg-opacity-40 dark:text-pink-300 dark:hover:bg-opacity-20 bg-pink-700  rounded-full text-green-700 border border-pink-500 bg-opacity-10 shadow hover:bg-opacity-25",

        small:
          "p-0 px-1 h-[25px] dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 bg-black bg-opacity-15 rounded-full text-slate-900 dark:text-white border border-slate-700 bg-opacity-10 shadow hover:bg-opacity-25",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
