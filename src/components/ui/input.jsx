import React from "react";

const cn = (...values) => values.filter(Boolean).join(" ");

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
