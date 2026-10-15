import { test, expect } from "@playwright/test";
import { describeBrowser, POST, readImages } from "../../api/feedback";

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
