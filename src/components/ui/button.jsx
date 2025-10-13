import React from "react";
import { cn } from "../../lib/utils";

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 focus-visible:ring-[var(--color-primary)]",
  outline:
    "border border-[var(--color-border)] bg-transparent text-slate-700 hover:bg-[var(--color-muted)] focus-visible:ring-[var(--color-primary)]",
  ghost: "bg-transparent text-slate-600 hover:bg-[var(--color-muted)]",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600",
};

export const Button = ({ className, variant = "default", ...props }) => {
  const variantClasses = variants[variant] ?? variants.default;
  return <button className={cn(baseStyles, variantClasses, className)} {...props} />;
};

export default Button;
