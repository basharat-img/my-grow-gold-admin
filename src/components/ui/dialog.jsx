import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { cn } from "../../lib/utils";

const DialogContext = createContext(undefined);

const Dialog = ({ open: openProp, onOpenChange, defaultOpen = false, children }) => {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (value) => {
      const next = typeof value === "boolean" ? value : !open;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, open],
  );

  const contextValue = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog /> component.");
  }
  return context;
};

const DialogTrigger = ({ asChild = false, children, ...props }) => {
  const { setOpen } = useDialogContext();

  const handleClick = (event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) {
      setOpen(true);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (event) => {
        children.props?.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button type="button" {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

const DialogOverlay = ({ className, ...props }) => (
  <div
    className={cn("fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity", className)}
    {...props}
  />
);

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useDialogContext();

  if (!open || typeof document === "undefined") {
    return null;
  }

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleOverlayClick = () => {
    setOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogOverlay onClick={handleOverlayClick} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-md rounded-lg border border-[var(--color-border)] bg-white p-6 shadow-xl",
          className,
        )}
        onClick={stopPropagation}
        {...props}
      >
        <DialogClose
          className="absolute right-4 top-4 rounded-full border border-transparent p-1 text-slate-500 transition-colors hover:text-slate-800"
          aria-label="Close dialog"
        />
        {children}
      </div>
    </div>,
    document.body,
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("mb-4 space-y-1", className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-600", className)} {...props} />
);

const DialogClose = ({ asChild = false, children, className, ...props }) => {
  const { setOpen } = useDialogContext();

  const handleClick = (event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) {
      setOpen(false);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (event) => {
        children.props?.onClick?.(event);
        handleClick(event);
      },
    });
  }

  return (
    <button type="button" className={cn("text-sm text-slate-500", className)} onClick={handleClick} {...props}>
      {children ?? <FiX className="h-4 w-4" />}
    </button>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
