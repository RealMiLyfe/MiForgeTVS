import { cn } from "@/lib/utils";

interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function MonoLabel({ children, className }: MonoLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-[0.15em] text-milyfe-text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
