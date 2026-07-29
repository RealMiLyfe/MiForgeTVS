"use client";

import { cn } from "@/lib/utils";

interface GradientHeadlineProps {
  children: React.ReactNode;
  size?: "hero" | "section" | "card";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

const sizeClasses = {
  hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]",
  section: "text-3xl sm:text-4xl md:text-5xl leading-[1.15]",
  card: "text-xl sm:text-2xl leading-[1.2]",
};

export function GradientHeadline({
  children,
  size = "section",
  className,
  as: Tag = "h2",
}: GradientHeadlineProps) {
  return (
    <Tag
      className={cn(
        "font-fraunces font-bold text-milyfe-gradient",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
