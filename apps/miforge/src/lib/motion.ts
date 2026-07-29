import { type Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

export const pinDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const crossFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Reduced motion wrapper - respects prefers-reduced-motion
export const getMotionProps = (variants: Variants) => {
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return {
        initial: "visible",
        animate: "visible",
        variants: {
          hidden: {},
          visible: {},
        },
      };
    }
  }
  return {
    initial: "hidden",
    animate: "visible",
    variants,
  };
};

// Hook-friendly reduced motion check
export const reducedMotionVariants: Variants = {
  hidden: {},
  visible: {},
};
