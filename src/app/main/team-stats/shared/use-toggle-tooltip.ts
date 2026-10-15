import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

// Which of several buttons has its tooltip open. Hovering or focusing a button opens its
// tooltip, a tap or click toggles it, and leaving, blurring, or Escape closes it.
export default function useToggleTooltip<Key>() {
  const [open, setOpen] = useState<Key | null>(null);
  // Whether the tooltip was open when the press began, before hovering or focusing opened it
  const pressedOpen = useRef<boolean | undefined>(undefined);
  const close = () => setOpen(null);

  const triggerProps = (key: Key) => ({
    onPointerDown: () => {
      pressedOpen.current = open === key;
    },
    onPointerCancel: () => {
      pressedOpen.current = undefined;
    },
    onMouseEnter: () => setOpen(key),
    onMouseLeave: close,
    onFocus: () => setOpen(key),
    onBlur: close,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    onClick: (e: MouseEvent) => {
      const wasOpen =
        e.detail ? (pressedOpen.current ?? open === key) : open === key;
      pressedOpen.current = undefined;
      setOpen(wasOpen ? null : key);
    },
  });

  return { open, triggerProps };
}
