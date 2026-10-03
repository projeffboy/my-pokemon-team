const SHOWDOWN_SPRITES = "https://play.pokemonshowdown.com/sprites/";
// vercel.json proxies this path to Showdown's sprites, which do not allow cross-origin reads
const PROXIED_SPRITES = "/showdown-sprites/";
// The most base64 the screenshot and uploaded images may total, since Vercel rejects
// function requests over 4.5 MB. api/feedback.ts checks the same limit.
export const MAX_IMAGES_LENGTH = 4_000_000;
// Browsers can pause rendering in a hidden tab, which stalls the capture
const TIMEOUT_MS = 10_000;

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
  try {
    const { domToJpeg } = await import("modern-screenshot");
    const capture = domToJpeg(document.body, {
      quality: 0.8,
      scale: 1,
      filter: node => node !== dialog && node.nodeName !== "NOSCRIPT",
      fetchFn: async url => {
        if (!url.startsWith(SHOWDOWN_SPRITES)) return false;
        const response = await fetch(
          PROXIED_SPRITES + url.slice(SHOWDOWN_SPRITES.length),
        );
        return response.ok ? toDataUrl(await response.blob()) : false;
      },
    });
    const screenshot = await Promise.race([
      capture,
      new Promise<undefined>(resolve => setTimeout(resolve, TIMEOUT_MS)),
    ]);
    return screenshot && screenshot.length <= maxLength ?
        screenshot
      : undefined;
  } catch {
    return undefined;
  }
}

export const describeScreen = () =>
  `${innerWidth}×${innerHeight} window, ${screen.width}×${screen.height} screen at ${devicePixelRatio}x`;
