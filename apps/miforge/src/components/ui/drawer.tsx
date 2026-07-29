"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Simplified drawer using dialog pattern for Tailwind v3 compatibility
interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Drawer({ open, onOpenChange: _onOpenChange, children }: DrawerProps) {
  void _onOpenChange;
  return <div data-state={open ? "open" : "closed"}>{children}</div>;
}

function DrawerTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-milyfe-border bg-milyfe-surface",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-milyfe-border" />
      {children}
    </div>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-milyfe-text-muted", className)} {...props} />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
