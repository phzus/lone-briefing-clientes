import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cn } from '@/lib/utils'

const ToggleGroup = React.forwardRef(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-wrap gap-2', className)}
    {...props}
  />
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground hover:border-primary/30',
      'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      className
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
))
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
