"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "aspect-square h-4 w-4 border border-white/30 text-[#C0A66A] shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C0A66A] disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-[#C0A66A]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center">
        <span className="h-2 w-2 bg-[#C0A66A]" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
