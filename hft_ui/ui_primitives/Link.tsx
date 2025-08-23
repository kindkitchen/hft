// components/ui/Link.tsx
import { JSX } from "preact/jsx-runtime";
import { cn } from "../utils.ts";

type LinkVariant = "default" | "outline" | "ghost" | "destructive";
type LinkSize = "sm" | "md" | "lg";

interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  size?: LinkSize;
}

export function Link({
  variant = "default",
  size = "md",
  className,
  ...props
}: LinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants: Record<LinkVariant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes: Record<LinkSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <a class={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
