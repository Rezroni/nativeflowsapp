"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { duration, easing } from "@/lib/animations/variants"

export interface InputProps extends React.ComponentProps<"input"> {
  /**
   * Whether to animate the input on focus/blur
   * @default true
   */
  animated?: boolean

  /**
   * Error message to display below the input
   */
  error?: string

  /**
   * Floating label text
   */
  label?: string

  /**
   * Helper text to display below the input
   */
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    animated = true,
    error,
    label,
    helperText,
    placeholder,
    value,
    defaultValue,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value || !!defaultValue)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

    // Track if input has value for floating label
    React.useEffect(() => {
      if (inputRef.current) {
        setHasValue(!!inputRef.current.value)
      }
    }, [value, inputRef])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    const isLabelFloating = isFocused || hasValue

    // Base input without animations (for reduced motion or disabled animations)
    if (!animated) {
      return (
        <div className="w-full">
          {label && !placeholder && (
            <label className="text-sm font-medium mb-1.5 block">
              {label}
            </label>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={inputRef}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...props}
          />
          {(error || helperText) && (
            <p className={cn(
              "text-xs mt-1.5",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {error || helperText}
            </p>
          )}
        </div>
      )
    }

    // Animated input
    return (
      <div className="w-full">
        <div className="relative">
          {/* Floating Label */}
          {label && (
            <motion.label
              htmlFor={props.id}
              initial={false}
              animate={{
                y: isLabelFloating ? -8 : 12,
                scale: isLabelFloating ? 0.85 : 1,
                color: isFocused
                  ? 'hsl(var(--primary))'
                  : error
                  ? 'hsl(var(--destructive))'
                  : 'hsl(var(--muted-foreground))',
              }}
              transition={{
                duration: duration.fast,
                ease: easing.smooth,
              }}
              className={cn(
                "absolute left-3 pointer-events-none origin-left font-medium z-10",
                "bg-background px-1"
              )}
              style={{
                top: 0,
              }}
            >
              {label}
            </motion.label>
          )}

          {/* Animated Border Glow */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-md pointer-events-none",
                  error ? "bg-destructive/10" : "bg-primary/10"
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: duration.fast,
                  ease: easing.smooth,
                }}
              />
            )}
          </AnimatePresence>

          {/* Input Field */}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative z-0",
              "transition-colors duration-150 ease-in-out",
              label ? "pt-4 pb-1" : "py-2",
              isFocused && !error && "border-primary ring-2 ring-primary ring-offset-2",
              error && "border-destructive focus-visible:ring-destructive",
              !isFocused && !error && "border-input",
              className
            )}
            ref={inputRef}
            value={value}
            defaultValue={defaultValue}
            placeholder={label ? (isLabelFloating ? placeholder : '') : placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </div>

        {/* Error Message or Helper Text with Animation */}
        <AnimatePresence mode="wait">
          {(error || helperText) && (
            <motion.p
              key={error ? 'error' : 'helper'}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{
                duration: duration.fast,
                ease: easing.smooth,
              }}
              className={cn(
                "text-xs mt-1.5",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
