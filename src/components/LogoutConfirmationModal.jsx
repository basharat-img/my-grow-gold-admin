import React, { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { Button } from "./ui/button";

const LogoutConfirmationModal = ({ open, onCancel, onConfirm }) => {
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
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
        className="w-full max-w-sm rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <FiLogOut className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 id="logout-dialog-title" className="mt-5 text-xl font-semibold text-slate-900">
          Ready to log out?
        </h2>
        <p id="logout-dialog-description" className="mt-2 text-sm text-slate-500">
          You can always sign back in at any time. Are you sure you want to end this session now?
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            type="button"
            onClick={() => onConfirm?.()}
            className="w-40 justify-center border-rose-200 bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500"
            autoFocus
          >
            Logout
          </Button>
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
