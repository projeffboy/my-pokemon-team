import store from "@/store";

// The Clipboard API needs a secure context, which a dev server opened over the LAN lacks
function copyWithTextarea(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- the only copy method outside secure contexts
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

// Copies the text and reports the outcome in the snackbar
export default async function copyToClipboard(
  text: string,
  copiedMessage: string,
  failedMessage: string,
) {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else if (!copyWithTextarea(text)) throw new Error("Copy failed");
    store.openSnackbar(copiedMessage);
  } catch {
    store.openSnackbar(failedMessage);
  }
}
