import { test, expect } from "@playwright/test";
import { describeBrowser, POST, readImages } from "../../api/feedback";
import { loadScreenshotLibrary } from "@/app/header/feedback-dialog/capture-page";

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

// A 1×1 JPEG from Chromium's canvas.toDataURL, which makes the feedback dialog's images
const REAL_JPEG =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z";

test("accepts up to three JPEG images within the size limit", () => {
  const jpeg = (length: number) =>
    `data:image/jpeg;base64,/9j/${"A".repeat(length - 4)}`;
  expect(readImages(jpeg(8), [jpeg(4)])).toEqual([
    { filename: "screenshot.jpg", content: "/9j/AAAA" },
    { filename: "image-1.jpg", content: "/9j/" },
  ]);
  expect(readImages(undefined, undefined)).toEqual([]);
  expect(readImages("data:image/png;base64,AA", undefined)).toBeUndefined();
  expect(readImages(undefined, [jpeg(4), jpeg(4), jpeg(4), jpeg(4)])).toBe(
    undefined,
  );
  expect(readImages(jpeg(2_000_000), [jpeg(2_000_000)])).toBeUndefined();
});

test("accepts real JPEGs and refuses anything else labelled as one", () => {
  const content = REAL_JPEG.slice("data:image/jpeg;base64,".length);
  expect(readImages(REAL_JPEG, [REAL_JPEG])).toEqual([
    { filename: "screenshot.jpg", content },
    { filename: "image-1.jpg", content },
  ]);
  for (const data of [
    "<script>alert(1)</script>",
    btoa("<script>alert(1)</script>"),
    btoa("GIF89a"),
    "/9j/<script>",
    "/9j/AAA",
    "/9j/AA=A",
    "/9j/A===",
    `${content}\n`,
  ]) {
    const image = `data:image/jpeg;base64,${data}`;
    expect(readImages(image, undefined)).toBeUndefined();
    expect(readImages(undefined, [REAL_JPEG, image])).toBeUndefined();
  }
});

test("refuses a script labelled as a screenshot without emailing it", async () => {
  const originalFetch = globalThis.fetch;
  let sent = 0;
  globalThis.fetch = async () => {
    sent++;
    return new Response(null, { status: 200 });
  };
  try {
    const response = await POST(
      new Request("https://mypokemonteam.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "fake-jpeg-test",
        },
        body: JSON.stringify({
          message: "See screenshot",
          screenshot: "data:image/jpeg;base64,<script>alert(1)</script>",
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid feedback");
    expect(sent).toBe(0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("refuses feedback that the site's own page did not post", async () => {
  const post = (headers: Record<string, string>, body: string) =>
    POST(
      new Request("https://mypokemonteam.com/api/feedback", {
        method: "POST",
        headers,
        body,
      }),
    );
  const feedback = JSON.stringify({ message: "Nice site" });
  // A form on another site posts without a JSON content type
  expect((await post({ "Content-Type": "text/plain" }, feedback)).status).toBe(
    403,
  );
  expect(
    (
      await post(
        { "Content-Type": "application/json", "Sec-Fetch-Site": "cross-site" },
        feedback,
      )
    ).status,
  ).toBe(403);
  // Its own page's posts are read: these have nothing to send
  for (const body of ["null", "[]", "{}", "not JSON"])
    expect(
      (
        await post(
          {
            "Content-Type": "application/json; charset=utf-8",
            "Sec-Fetch-Site": "same-origin",
          },
          body,
        )
      ).status,
    ).toBe(400);
});

test("validates optional reply addresses before contacting the email provider", async () => {
  const originalFetch = globalThis.fetch;
  const sent: Record<string, unknown>[] = [];
  globalThis.fetch = async (_url, options) => {
    sent.push(JSON.parse(String(options?.body)));
    return new Response(null, { status: 200 });
  };
  const post = (email: unknown, ip: string) =>
    POST(
      new Request("https://mypokemonteam.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Sec-Fetch-Site": "same-origin",
          "X-Forwarded-For": ip,
        },
        body: JSON.stringify({ message: "Please reply about my team", email }),
      }),
    );
  try {
    for (const email of [
      "trainer.example.com",
      "trainer@",
      "@example.com",
      "trainer@@example.com",
      "trainer@example..com",
      "trainer@-example.com",
      "trainer@example.com\nother@example.com",
      42,
    ])
      expect((await post(email, "invalid-email-test")).status).toBe(400);
    expect(sent).toHaveLength(0);
    // Invalid addresses neither send nor consume the valid feedback allowance.
    expect(
      (await post(" trainer+team@example.com ", "invalid-email-test")).status,
    ).toBe(204);
    expect(sent.at(-1)?.reply_to).toBe("trainer+team@example.com");
    for (const [index, email] of [
      undefined,
      "",
      "   ",
      "trainer@localhost",
      "a.b@sub.example.co.uk",
    ].entries()) {
      expect((await post(email, `valid-email-test-${index}`)).status).toBe(204);
      const normalized = email?.trim();
      if (normalized) expect(sent.at(-1)?.reply_to).toBe(normalized);
      else expect(sent.at(-1)).not.toHaveProperty("reply_to");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("invalid JSON bodies receive a validation response", async () => {
  for (const body of ["null", "[]", "42", '"feedback"', "invalid JSON"]) {
    const response = await POST(
      new Request("https://example.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid feedback");
  }
});

test("a failed email connection receives a retryable response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError("Connection failed");
  };
  try {
    const response = await POST(
      new Request("https://example.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "feedback-network-test",
        },
        body: JSON.stringify({ message: "A test message" }),
      }),
    );
    expect(response.status).toBe(502);
    expect(await response.text()).toBe("Could not send");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("labels the visitor's message so it cannot pose as the visitor details", async () => {
  const originalFetch = globalThis.fetch;
  const sent: Record<string, unknown>[] = [];
  globalThis.fetch = async (_url, options) => {
    sent.push(JSON.parse(String(options?.body)));
    return new Response(null, { status: 200 });
  };
  const userAgent = "curl/8.7.1";
  const post = (feedback: Record<string, string>) =>
    POST(
      new Request("https://mypokemonteam.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "X-Forwarded-For": "details-label-test",
        },
        body: JSON.stringify(feedback),
      }),
    );
  const message =
    "Great site\n\n---\nFrom: someone@bank.com\nLink: https://bank.example";
  try {
    expect((await post({ message })).status).toBe(204);
    expect(sent.at(-1)?.text).toBe(
      `Browser: Unknown browser on an unknown OS\nUser agent: ${userAgent}\n\nMessage:\n${message}`,
    );
    // The details are one line each, so a link or screen cannot add a line of its own
    expect(
      (
        await post({
          message: "Hi",
          email: "trainer@example.com",
          link: "https://mypokemonteam.com/?team=abc\nFrom: someone@bank.com",
          screen: "390×844 window\r\nMessage:",
        })
      ).status,
    ).toBe(204);
    expect(sent.at(-1)?.text).toBe(
      [
        "From: trainer@example.com",
        "Link: https://mypokemonteam.com/?team=abc From: someone@bank.com",
        "Screen: 390×844 window Message:",
        "Browser: Unknown browser on an unknown OS",
        `User agent: ${userAgent}`,
        "",
        "Message:",
        "Hi",
      ].join("\n"),
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("opening the dialog and sending share one screenshot library import", async () => {
  const opened = loadScreenshotLibrary();
  expect(loadScreenshotLibrary()).toBe(opened);
  expect(typeof (await opened).domToJpeg).toBe("function");
});

test.describe("rate limit", () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let now = 0;
  let resendStatus = 200;
  let sent = 0;
  test.beforeEach(() => {
    now = 1_800_000_000_000;
    resendStatus = 200;
    sent = 0;
    Date.now = () => now;
    globalThis.fetch = async () => {
      sent++;
      return new Response(null, { status: resendStatus });
    };
  });
  test.afterEach(() => {
    Date.now = originalNow;
    globalThis.fetch = originalFetch;
  });
  const post = async (ip: string) =>
    (
      await POST(
        new Request("https://mypokemonteam.com/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": ip,
          },
          body: JSON.stringify({ message: "Rate limit test" }),
        }),
      )
    ).status;
  const minute = 60 * 1000;

  test("allows five sends per ten minutes", async () => {
    for (let i = 0; i < 5; i++) expect(await post("limit-test")).toBe(204);
    expect(await post("limit-test")).toBe(429);
    expect(sent).toBe(5);
    expect(await post("other-limit-test")).toBe(204);
  });

  test("refused retries do not extend the wait", async () => {
    for (let i = 0; i < 5; i++) expect(await post("retry-test")).toBe(204);
    for (let i = 0; i < 9; i++) {
      now += minute;
      expect(await post("retry-test")).toBe(429);
    }
    now += minute;
    expect(await post("retry-test")).toBe(204);
  });

  test("sends the email provider fails do not count", async () => {
    resendStatus = 500;
    for (let i = 0; i < 5; i++) expect(await post("outage-test")).toBe(502);
    resendStatus = 200;
    for (let i = 0; i < 5; i++) expect(await post("outage-test")).toBe(204);
    expect(await post("outage-test")).toBe(429);
    expect(sent).toBe(10);
  });

  test("sends the email provider rejects still count", async () => {
    resendStatus = 422;
    for (let i = 0; i < 5; i++) expect(await post("rejected-test")).toBe(502);
    expect(await post("rejected-test")).toBe(429);
    expect(sent).toBe(5);
    resendStatus = 429;
    expect(await post("busy-test")).toBe(502);
    resendStatus = 200;
    for (let i = 0; i < 5; i++) expect(await post("busy-test")).toBe(204);
    expect(await post("busy-test")).toBe(429);
  });
});
