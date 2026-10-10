import { useEffect, useRef } from "react";

export function useSelectionAnimation(
  selection: number | undefined,
  eligible: boolean,
  sprite?: { src: string; duration: number },
) {
  const ref = useRef<HTMLImageElement>(null);
  const latestSelection = useRef(0);
  if (selection !== undefined) latestSelection.current = selection;
  const sequence = latestSelection.current;
  const src = sprite?.src;
  const duration = sprite?.duration;

  useEffect(() => {
    const image = ref.current;
    if (
      !eligible ||
      !image ||
      !src ||
      !duration ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const still = image.getAttribute("src") ?? "";
    // A fresh URL restarts cached GIF/APNG frames, including a repeated selection.
    const animated = `${src}${src.includes("?") ? "&" : "?"}selection=${sequence}`;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const restore = () => {
      image.removeAttribute("data-selection-animating");
      if (image.getAttribute("src") === animated) {
        image.style.removeProperty("--sprite-scale");
        image.src = still;
      }
    };
    const play = () => {
      // Showdown's stills use a 96px canvas; preserve that pixel scale.
      image.style.setProperty(
        "--sprite-scale",
        String(image.naturalWidth / 96),
      );
      timer = setTimeout(restore, duration);
    };
    const failed = () => {
      image.removeAttribute("data-selection-animating");
      image.removeEventListener("load", play);
    };
    image.addEventListener("load", play, { once: true });
    image.addEventListener("error", failed, { once: true });
    image.setAttribute("data-selection-animating", "");
    image.src = animated;
    return () => {
      image.removeEventListener("load", play);
      image.removeEventListener("error", failed);
      clearTimeout(timer);
      restore();
    };
  }, [sequence, eligible, src, duration]);

  return ref;
}
