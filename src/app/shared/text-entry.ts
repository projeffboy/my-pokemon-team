import type { AutocompleteCloseReason } from "@mui/material/Autocomplete";

// Browsers and phones offer saved passwords, cards, addresses, and contacts in
// any field they take for a form that wants them. Chrome and iOS Safari can
// ignore autocomplete="off", but both skip a field whose name says it is a search.
export const noAutofill = (name: string) => ({
  autoComplete: "off",
  name: `search-${name}`,
});

// Team data, Showdown text, and email addresses stay as typed: no spelling
// marks, autocorrect, or automatic capitals
export const verbatim = (name: string) => ({
  ...noAutofill(name),
  spellCheck: false,
  autoCorrect: "off",
  autoCapitalize: "none",
});

// Whether the last press was a touch or a pen, which opens the on-screen keyboard
let isTouch = false;
addEventListener(
  "pointerdown",
  event => {
    isTouch = event.pointerType === "touch" || event.pointerType === "pen";
  },
  { capture: true, passive: true },
);
// Keys that on-screen keyboards lack mean a hardware keyboard, e.g. on a tablet. Phone
// keyboards also send Enter and letters, so those keep the touch.
addEventListener(
  "keydown",
  event => {
    if (/^(Tab|Arrow|Escape|Home|End|Page)/.test(event.key)) isTouch = false;
  },
  { capture: true, passive: true },
);

export const isTouchInput = () => isTouch;

// Closing a dropdown after a tap blurs its field, so the on-screen keyboard
// closes with it. A tap on the field itself, a mouse, and a hardware keyboard
// keep the focus, as does Escape, which on-screen keyboards lack.
export const closeKeyboard = (
  event?: React.SyntheticEvent,
  reason?: AutocompleteCloseReason,
) => {
  const field = document.activeElement;
  if (
    !isTouch ||
    reason === "blur" ||
    reason === "escape" ||
    (reason === "toggleInput" && event?.target === field) ||
    !(field instanceof HTMLInputElement)
  )
    return;
  // Once the tap is handled, since the dropdown focuses its field on a click
  queueMicrotask(() => {
    if (document.activeElement === field) field.blur();
  });
};
