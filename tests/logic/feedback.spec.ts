import { test, expect } from "@playwright/test";
import { describeBrowser, readImages } from "../../api/feedback";

test("names the browser and OS from the user agent", () => {
  const userAgents = {
    "Edge 154 on macOS":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36 Edg/154.0.0.0",
    "Chrome 140 on Android":
      "Mozilla/5.0 (Linux; Android 15; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
    "Safari 26 on iOS":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
    "Firefox 143 on Windows":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
    "Unknown browser on an unknown OS": "curl/8.7.1",
  };
  for (const [description, userAgent] of Object.entries(userAgents)) {
    expect(describeBrowser(userAgent)).toBe(description);
  }
});

test("accepts up to three JPEG images within the size limit", () => {
  const jpeg = (length: number) =>
    `data:image/jpeg;base64,${"A".repeat(length)}`;
  expect(readImages(jpeg(4), [jpeg(2)])).toEqual([
    { filename: "screenshot.jpg", content: "AAAA" },
    { filename: "image-1.jpg", content: "AA" },
  ]);
  expect(readImages(undefined, undefined)).toEqual([]);
  expect(readImages("data:image/png;base64,AA", undefined)).toBeUndefined();
  expect(readImages(undefined, [jpeg(1), jpeg(1), jpeg(1), jpeg(1)])).toBe(
    undefined,
  );
  expect(readImages(jpeg(2_000_000), [jpeg(2_000_000)])).toBeUndefined();
});
