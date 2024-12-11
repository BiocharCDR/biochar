"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { BookDashedIcon } from "lucide-react";

const InputOTP = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    maxLength?: number;
    render?: (props: { slots: string[] }) => React.ReactNode;
  }
>(({ className, maxLength = 6, render, ...props }, ref) => {
  const [value, setValue] = React.useState("");
  const slots = value.split("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, maxLength);
    setValue(newValue);
    props.onChange?.(e);
  };

  return render ? (
    render({ slots })
  ) : (
    <Input
      ref={ref}
      value={value}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index: number;
  }
>(({ index, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-10 rounded-md border border-input bg-background text-center text-sm shadow-sm transition-all",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "opacity-50"
        )}
      >
        {props.children || <BookDashedIcon className="h-4 w-4" />}
      </div>
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
