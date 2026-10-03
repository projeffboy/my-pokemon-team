// Emails a visitor's feedback to the site's author through Resend.
// Needs the RESEND_API_KEY environment variable in Vercel.

const TO = "jeffery124@gmail.com";
const MAX_MESSAGE_LENGTH = 5000;
// The most base64 the screenshot and uploaded images may total, as in capture-page.ts
const MAX_IMAGES_LENGTH = 4_000_000;
const MAX_UPLOADS = 3;
const JPEG_PREFIX = "data:image/jpeg;base64,";
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best effort: Vercel reuses an instance for many requests, but not all of them
const recentSends = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const sends = (recentSends.get(ip) ?? []).filter(
    time => now - time < RATE_WINDOW_MS,
  );
  recentSends.set(ip, [...sends, now]);
  return sends.length >= RATE_LIMIT;
}

// Order matters: Edge and Opera also say Chrome, and Chrome also says Safari
const BROWSERS: [string, RegExp][] = [
  ["Edge", /Edg(?:e|A|iOS)?\/(\d+)/],
  ["Opera", /OPR\/(\d+)/],
  ["Samsung Internet", /SamsungBrowser\/(\d+)/],
  ["Firefox", /(?:Firefox|FxiOS)\/(\d+)/],
  ["Chrome", /(?:Chrome|CriOS)\/(\d+)/],
  ["Safari", /Version\/(\d+).*Safari/],
];
const SYSTEMS: [string, RegExp][] = [
  ["iOS", /iPhone|iPad|iPod/],
  ["Android", /Android/],
  ["Windows", /Windows/],
  ["ChromeOS", /CrOS/],
  ["macOS", /Mac OS X/],
  ["Linux", /Linux/],
];

export function describeBrowser(userAgent: string) {
  const browser = BROWSERS.flatMap(([name, pattern]) => {
    const version = pattern.exec(userAgent)?.[1];
    return version ? [`${name} ${version}`] : [];
  })[0];
  const system = SYSTEMS.find(([, pattern]) => pattern.test(userAgent))?.[0];
  return `${browser ?? "Unknown browser"} on ${system ?? "an unknown OS"}`;
}

const isString = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.length <= maxLength;
const isOptionalString = (value: unknown, maxLength: number) =>
  value === undefined || isString(value, maxLength);
const isJpeg = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith(JPEG_PREFIX);

// The screenshot and uploaded images, or undefined if they are invalid or too large
export function readImages(screenshot: unknown, images: unknown) {
  const uploads = images ?? [];
  if (
    (screenshot !== undefined && !isJpeg(screenshot)) ||
    !Array.isArray(uploads) ||
    uploads.length > MAX_UPLOADS ||
    !uploads.every(isJpeg)
  ) {
    return undefined;
  }
  const attachments = [
    ...(screenshot ? [{ filename: "screenshot.jpg", data: screenshot }] : []),
    ...uploads.map((data, i) => ({ filename: `image-${i + 1}.jpg`, data })),
  ];
  const length = attachments.reduce((sum, { data }) => sum + data.length, 0);
  return length <= MAX_IMAGES_LENGTH ?
      attachments.map(({ filename, data }) => ({
        filename,
        content: data.slice(JPEG_PREFIX.length),
      }))
    : undefined;
}

export async function POST(request: Request) {
  const { message, email, link, screen, screenshot, images } = await request
    .json()
    .catch(() => ({}) as Record<string, unknown>);
  if (
    !isString(message, MAX_MESSAGE_LENGTH) ||
    !message.trim() ||
    !isOptionalString(email, 254) ||
    !isOptionalString(link, 4000) ||
    !isOptionalString(screen, 200)
  ) {
    return new Response("Invalid feedback", { status: 400 });
  }
  const attachments = readImages(screenshot, images);
  if (!attachments) {
    return new Response("Invalid feedback", { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "";
  if (isRateLimited(ip)) {
    return new Response("Too many messages", { status: 429 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const replyTo = email?.trim();
  const details = [
    replyTo && `From: ${replyTo}`,
    link && `Link: ${link}`,
    screen && `Screen: ${screen}`,
    `Browser: ${describeBrowser(userAgent)}`,
    `User agent: ${userAgent}`,
  ].filter(line => line);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "My Pokemon Team <onboarding@resend.dev>",
      to: [TO],
      subject: "My Pokemon Team feedback",
      text: `${message}\n\n---\n${details.join("\n")}`,
      ...(replyTo?.includes("@") && { reply_to: replyTo }),
      ...(attachments.length > 0 && { attachments }),
    }),
  });
  if (!response.ok) {
    console.error("Resend failed", response.status, await response.text());
    return new Response("Could not send", { status: 502 });
  }
  return new Response(null, { status: 204 });
}
