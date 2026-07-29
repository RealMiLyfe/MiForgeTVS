"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-milyfe-surface group-[.toaster]:text-milyfe-text group-[.toaster]:border-milyfe-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-milyfe-text-muted",
          actionButton:
            "group-[.toast]:bg-milyfe-emerald group-[.toast]:text-milyfe-bg",
          cancelButton:
            "group-[.toast]:bg-milyfe-surface-2 group-[.toast]:text-milyfe-text-muted",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
