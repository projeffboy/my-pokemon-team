import type { SnackbarKind } from "@/types";
import store from "@/store";

// The Clipboard API needs a secure context, which a dev server opened over the LAN lacks
function copyWithTextarea(text: string) {
  const previousFocus = document.activeElement;
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.tabIndex = -1;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  const container =
    previousFocus?.closest('[role="dialog"], [role="menu"]') ?? document.body;
  container.appendChild(textArea);
  try {
    textArea.focus();
    textArea.select();
    if (
      document.activeElement !== textArea ||
      textArea.selectionEnd !== text.length
    )
      return false;
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- the only copy method outside secure contexts
    return document.execCommand("copy");
  } finally {
    textArea.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }
}

// Copies the text and reports the outcome in the snackbar
export default async function copyToClipboard(
  text: string,
  copiedMessage: string,
  failedMessage: string,
  kind: SnackbarKind = "copy",
) {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else if (!copyWithTextarea(text)) throw new Error("Copy failed");
    store.openSnackbar(copiedMessage, false, kind);
  } catch {
    store.openSnackbar(failedMessage, false, "error");
  }
}
