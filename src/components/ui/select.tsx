import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6m0 6m0 6m-6 6m0 6" />
        </svg>
      </select>
    )
  }
)

SelectTrigger.displayName = "SelectTrigger"

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6m0 6m0 6m-6 6m0 6" />
        </svg>
      </select>
    )
  }
)

Select.displayName = "Select"

// Helper function to get text color for select options
const getOptionTextColor = (optionValue: string, currentValue?: string) => {
  // If this is the selected value, use white text
  if (currentValue === optionValue) {
    return 'text-white';
  }
  return 'text-black';
};

const SelectOption = ({ children, value, currentValue }: { children: React.ReactNode; value: string; currentValue?: string }) => {
  return (
    <option 
      value={value}
      className={cn(
        getOptionTextColor(value, currentValue)
      )}
    >
      {children}
    </option>
  );
};

const SelectItem = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6m0 6m0 6m-6 6m0 6" />
        </svg>
      </select>
    )
  }
)

SelectItem.displayName = "SelectItem"

const SelectValueComponent = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6m0 6m0 6m-6 6m0 6" />
        </svg>
      </select>
    )
  }
)

SelectValueComponent.displayName = "SelectValue"

export { Select, SelectItem, SelectTrigger, SelectValueComponent as SelectValue }
