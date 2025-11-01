"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, MotionProps } from "framer-motion"

import { cn } from "@/lib/utils"
import { buttonVariants as animatedButtonVariants, shouldReduceMotion } from "@/lib/animations/variants"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * Enable animated interactions (hover, tap effects)
   * @default true
   */
  animated?: boolean
  /**
   * Show loading state with spinner
   */
  loading?: boolean
  /**
   * Icon variant for icon-only buttons (uses smaller scale animations)
   */
  iconButton?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    animated = true,
    loading = false,
    iconButton = false,
    disabled,
    children,
    onClick,
    type,
    form,
    name,
    value,
    autoFocus,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-pressed': ariaPressed,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHaspopup,
    id,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // Common props for both animated and non-animated versions
    const commonProps = {
      onClick,
      type,
      form,
      name,
      value,
      autoFocus,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-pressed': ariaPressed,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      'aria-haspopup': ariaHaspopup,
      id,
    }

    // If not animated or reduced motion is preferred, render without animations
    if (!animated || shouldReduceMotion() || asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          {...commonProps}
          {...props}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {children}
            </span>
          ) : (
            children
          )}
        </Comp>
      )
    }

    // Use appropriate animation variants based on button type
    const motionVariants = iconButton
      ? {
          rest: { scale: 1, rotate: 0 },
          hover: { scale: 1.1 },
          tap: { scale: 0.9, rotate: 5 },
        }
      : animatedButtonVariants

    // Render animated button with Framer Motion
    const MotionComp = motion.button

    return (
      <MotionComp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        variants={motionVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={{
          duration: 0.15,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        {...commonProps}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </MotionComp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
