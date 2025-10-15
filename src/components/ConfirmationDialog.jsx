import React, { useEffect } from "react";
import { Button } from "./ui/button";

const ConfirmationDialog = ({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  destructive,
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
      role="presentation"
      onClick={() => onCancel?.()}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby={description ? "confirmation-dialog-description" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-2">
          <h2 id="confirmation-dialog-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {description ? (
            <p id="confirmation-dialog-description" className="text-sm text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <Button type="button" variant="outline" onClick={() => onCancel?.()}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm?.()}
            className={destructive ? "border-rose-200 bg-rose-600 text-white hover:bg-rose-700" : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
