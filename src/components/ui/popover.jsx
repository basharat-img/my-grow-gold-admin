import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

const PopoverContext = React.createContext(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within <Popover>");
  }
  return context;
};

export const Popover = ({ children, open: openProp, defaultOpen = false, onOpenChange, className }) => {
  const [openInternal, setOpenInternal] = useState(defaultOpen);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openInternal;

  const setOpen = useCallback(
    (value) => {
      const resolved = typeof value === "function" ? value(open) : value;
      if (!isControlled) {
        setOpenInternal(resolved);
      }
      if (onOpenChange) {
        onOpenChange(resolved);
      }
    },
    [isControlled, onOpenChange, open],
  );

  const contextValue = useMemo(
    () => ({ open, setOpen, triggerRef, contentRef }),
    [open, setOpen],
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <div className={cn("relative inline-flex", className)}>{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = usePopoverContext();
  const mergedRef = useMemo(() => {
    return (node) => {
      triggerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
  }, [ref, triggerRef]);

  return (
    <button
      type="button"
      ref={mergedRef}
      className={cn("inline-flex items-center justify-center", className)}
      data-state={open ? "open" : "closed"}
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }
        if (!event.defaultPrevented) {
          setOpen((current) => !current);
        }
      }}
      {...props}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 8, onKeyDown, ...props }, ref) => {
    const { open, setOpen, triggerRef, contentRef } = usePopoverContext();
    const localRef = useRef(null);

    const mergedRef = useMemo(() => {
      return (node) => {
        localRef.current = node;
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref, contentRef]);

    useEffect(() => {
      if (!open) return undefined;

      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      const handlePointerDown = (event) => {
        const target = event.target;
        if (
          localRef.current &&
          !localRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    const alignmentClass =
      align === "start"
        ? "left-0"
        : align === "end"
          ? "right-0"
          : "left-1/2 -translate-x-1/2";

    return (
      <div
        ref={mergedRef}
        role="dialog"
        className={cn(
          "absolute z-50 mt-2 min-w-[12rem] rounded-lg border border-[var(--color-border)] bg-white p-3 text-sm shadow-xl focus:outline-none",
          alignmentClass,
          className,
        )}
        style={{ marginTop: sideOffset }}
        data-state="open"
        onKeyDown={(event) => {
          if (onKeyDown) {
            onKeyDown(event);
          }
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        {...props}
      />
    );
  },
);
PopoverContent.displayName = "PopoverContent";
