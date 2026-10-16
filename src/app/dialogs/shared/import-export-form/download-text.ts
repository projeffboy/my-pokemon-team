// Saves text as a file through a temporary link
export default function downloadText(
  filename: string,
  text: string,
  type = "text/plain",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Safari reads the file after the click returns
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
