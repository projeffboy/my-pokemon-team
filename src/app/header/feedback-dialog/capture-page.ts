import type { Context } from "modern-screenshot";
import {
  PROXIED_SPRITES,
  SHOWDOWN_SPRITES,
} from "@/app/shared/pokemon-sprite/sprite-urls";

// The most base64 the screenshot and uploaded images may total, since Vercel rejects
// function requests over 4.5 MB. api/feedback.ts checks the same limit.
export const MAX_IMAGES_LENGTH = 4_000_000;
// Browsers can pause rendering in a hidden tab, which stalls the capture
const TIMEOUT_MS = 10_000;
// Safari counts repeated icon-sheet backgrounds separately. Each decoder retry
// redraws the entire page, so retain the workaround with a bounded retry count.
const MAX_DECODE_REDRAWS = 3;

let screenshotLibrary: Promise<typeof import("modern-screenshot")> | undefined;
// The feedback dialog starts this when it opens. A tab opened before a deploy cannot load the
// chunk, and Index.tsx then reloads the page, which should happen before a message is typed
// rather than while it is being sent. Kept even if it fails, so sending never retries it.
// Not started offline: browsers keep failing an import that failed once, and the
// screenshot can still be taken once the tab is back online.
export const loadScreenshotLibrary = () => {
  if (navigator.onLine === false)
    return Promise.reject(
      new Error("The screenshot library needs a connection"),
    );
  if (!screenshotLibrary) {
    screenshotLibrary = import("modern-screenshot");
    screenshotLibrary.catch(() => {});
  }
  return screenshotLibrary;
};

// Whether a send is waiting for the library, which it first loads only when the dialog was
// opened offline. Index.tsx then does not reload a tab opened before a deploy, which would
// lose the message, and the feedback goes without the screenshot.
let sendingLoad = false;
export const isSendingFeedback = () => sendingLoad;

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

// A JPEG data URL of the page, leaving out the feedback dialog,
// or undefined if it fails or is longer than maxLength
export async function capturePage(dialog: Element | null, maxLength: number) {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cleanup = () => {};
  try {
    const timeout = new Promise<undefined>(resolve => {
      timer = setTimeout(() => {
        controller.abort();
        resolve(undefined);
      }, TIMEOUT_MS);
    });
    const capture = (async () => {
      sendingLoad = true;
      // Cleared when the import settles, even after the timeout gave up on it
      const { createContext, destroyContext, domToJpeg } =
        await loadScreenshotLibrary().finally(() => {
          sendingLoad = false;
        });
      if (controller.signal.aborted) return undefined;
      const context: Context<HTMLElement> = await createContext(document.body, {
        type: "image/jpeg",
        quality: 0.8,
        scale: 1,
        autoDestruct: false,
        filter: node => node !== dialog && node.nodeName !== "NOSCRIPT",
        fetch: {
          requestInit: { cache: "force-cache", signal: controller.signal },
        },
        // Showdown's sprites do not allow cross-origin reads
        fetchFn: async url => {
          if (!url.startsWith(`${SHOWDOWN_SPRITES}/`)) return false;
          const response = await fetch(
            PROXIED_SPRITES + url.slice(SHOWDOWN_SPRITES.length),
            { signal: controller.signal },
          );
          return response.ok ? toDataUrl(await response.blob()) : false;
        },
        onEmbedNode: () => {
          if (controller.signal.aborted)
            throw new DOMException(
              "Screenshot capture timed out",
              "AbortError",
            );
          context.drawImageCount = Math.min(
            context.drawImageCount,
            MAX_DECODE_REDRAWS,
          );
        },
      });
      if (controller.signal.aborted) {
        destroyContext(context);
        return undefined;
      }
      cleanup = () => destroyContext(context);
      return domToJpeg(context);
    })();
    const screenshot = await Promise.race([capture, timeout]);
    return screenshot && screenshot.length <= maxLength ?
        screenshot
      : undefined;
  } catch {
    return undefined;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    controller.abort();
    cleanup();
  }
}

export const describeScreen = () =>
  `${innerWidth}×${innerHeight} window, ${screen.width}×${screen.height} screen at ${devicePixelRatio}x`;
