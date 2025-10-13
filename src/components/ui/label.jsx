import React from "react";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={["text-sm font-medium text-slate-600", className].filter(Boolean).join(" ")}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
