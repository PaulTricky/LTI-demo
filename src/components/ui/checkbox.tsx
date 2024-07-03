"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex justify-center items-center rounded-[5px] !bg-white border-[#2d88bc]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("w-[10px] h-[10px] flex items-center justify-center text-current")}
    >
      <div className="h-full w-full rounded-[2px] text-[#2d88bc] bg-[#2d88bc] border-[#2d88bc]"></div>
      {/* <Square className="h-full w-full text-[#2d88bc] bg-[#2d88bc] border-[#2d88bc]" /> */}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
