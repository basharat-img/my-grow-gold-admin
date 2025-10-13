import React from "react";

const Card = ({ className, children }) => (
  <div
    className={["rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm", className]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={["mb-4 flex flex-col space-y-1", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={["text-xl font-semibold text-slate-800", className].filter(Boolean).join(" ")}>
    {children}
  </h3>
);

const CardDescription = ({ className, children }) => (
  <p className={["text-sm text-slate-500", className].filter(Boolean).join(" ")}>
    {children}
  </p>
);

const CardContent = ({ className, children }) => (
  <div className={["text-sm text-slate-600", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
