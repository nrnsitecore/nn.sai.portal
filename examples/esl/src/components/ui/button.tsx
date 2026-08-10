import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-accent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 antialiased font-semibold text-box-trim-both leading-5',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
        outline:
          'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover',
        ghost: 'hover:text-primary',
        link: 'rounded-none text-primary underline-offset-4 hover:underline after:text-primary after:content-[">"]',
        topic:
          'bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-4 py-2 text-sm transition-colors',
        'rounded-white':
          'rounded-full bg-light text-light-foreground hover:bg-light-hover transition-all duration-300',
      },
      size: {
        default: 'px-7 py-3 text-sm',
        sm: 'h-9 px-5',
        lg: 'h-12 px-9',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
