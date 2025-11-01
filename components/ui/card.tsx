import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { cardHoverVariants, shouldReduceMotion } from "@/lib/animations/variants"

interface CardProps {
  /**
   * Enable hover animations (elevation and scale)
   * @default false
   */
  animated?: boolean
  /**
   * Make card clickable with tap animation
   * @default false
   */
  clickable?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Click handler
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>
  /**
   * Child elements
   */
  children?: React.ReactNode
  /**
   * ARIA label
   */
  'aria-label'?: string
  /**
   * Element ID
   */
  id?: string
  /**
   * Tab index
   */
  tabIndex?: number
  /**
   * Role attribute
   */
  role?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = false, clickable = false, onClick, children, id, tabIndex, role, 'aria-label': ariaLabel }, ref) => {
    const commonProps = {
      onClick,
      id,
      tabIndex,
      role,
      'aria-label': ariaLabel,
    }

    // If not animated or reduced motion is preferred, render static card
    if (!animated || shouldReduceMotion()) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            clickable && "cursor-pointer",
            className
          )}
          {...commonProps}
        >
          {children}
        </div>
      )
    }

    // Render animated card with Framer Motion
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          clickable && "cursor-pointer",
          className
        )}
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap={clickable ? "tap" : undefined}
        transition={{
          duration: 0.15,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        {...commonProps}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export type { CardProps }
