import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

// Sending waits for the page screenshot, which takes WebKit several seconds
const SEND_TIMEOUT = 15000;

test.describe("Feedback Dialog - Unit Tests", () => {
  test("a cancelled send cannot clear a reopened feedback draft", async ({
    page,
  }) => {
    let release: () => void = () => {};
    const pending = new Promise<void>(resolve => {
      release = resolve;
    });
    const requested = page.waitForRequest("**/api/feedback");
    await page.route("/api/feedback", async route => {
      await pending;
      await route.fulfill({ status: 204 });
    });
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog.getByLabel("Your feedback").fill("Original feedback");
    await dialog.getByLabel("Attach a screenshot of the page").uncheck();
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await requested;
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Send feedback" }).click();
    await dialog.getByLabel("Your feedback").fill("A new draft");
    const responded = page.waitForResponse("**/api/feedback");
    release();
    await responded;
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Your feedback")).toHaveValue("A new draft");
  });

  test("overlapping image uploads retain both files", async ({ page }) => {
    await page.evaluate(() => {
      const createBitmap = window.createImageBitmap.bind(window);
      window.createImageBitmap = async (image: ImageBitmapSource) => {
        if (image instanceof File && image.name === "first.png")
          await new Promise(resolve => setTimeout(resolve, 500));
        return createBitmap(image);
      };
    });
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    const picker = dialog.locator("input[type=file]");
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64",
    );
    await picker.setInputFiles({
      name: "first.png",
      mimeType: "image/png",
      buffer,
    });
    await picker.setInputFiles({
      name: "second.png",
      mimeType: "image/png",
      buffer,
    });
    await expect(dialog.getByText("second.png", { exact: true })).toBeVisible();
    await expect(dialog.getByText("first.png", { exact: true })).toBeVisible();
    await expect(dialog.getByText("second.png", { exact: true })).toBeVisible();
  });

  test("sends the message, reply address, link, and screenshot", async ({
    page,
  }) => {
    await page.route(/(?:\/sprites\/|\/showdown-sprites\/)/, route =>
      route.fulfill({
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "base64",
        ),
      }),
    );
    const requests: Record<string, unknown>[] = [];
    await page.route("/api/feedback", route => {
      requests.push(route.request().postDataJSON());
      return route.fulfill({ status: 204 });
    });
    await selectPokemon(page, "Wobbuffet");
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    const send = dialog.getByRole("button", { name: "Send", exact: true });
    await expect(send).toBeDisabled();

    await dialog
      .getByLabel("Your feedback")
      .fill("Wobbuffet is missing Counter");
    await dialog
      .getByLabel("Your email (optional)")
      .fill("trainer@example.com");
    await send.click();
    await expect(dialog).toBeHidden({ timeout: SEND_TIMEOUT });
    await expect(
      page.getByText("Thanks! Your feedback was sent."),
    ).toBeVisible();
    expect(requests).toEqual([
      {
        message: "Wobbuffet is missing Counter",
        email: "trainer@example.com",
        link: expect.stringContaining("?team="),
        screen: expect.stringMatching(/^\d+×\d+ window, /),
        screenshot: expect.stringMatching(/^data:image\/jpeg;base64,/),
      },
    ]);

    await page.getByRole("button", { name: "Send feedback" }).click();
    await dialog.getByLabel("Your feedback").fill("No link this time");
    await dialog.getByLabel("Attach my team link").uncheck();
    await send.click();
    await expect(dialog).toBeHidden({ timeout: SEND_TIMEOUT });
    expect(requests[1]).toEqual({
      message: "No link this time",
      email: "trainer@example.com",
      screen: expect.any(String),
      screenshot: expect.stringMatching(/^data:image\/jpeg;base64,/),
    });
  });

  test("attaches uploaded images instead of the page screenshot", async ({
    page,
  }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route("/api/feedback", route => {
      requests.push(route.request().postDataJSON());
      return route.fulfill({ status: 204 });
    });
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog.getByLabel("Your feedback").fill("See my screenshot");
    await dialog.getByLabel("Attach a screenshot of the page").uncheck();

    const picker = dialog.locator("input[type=file]");
    await picker.setInputFiles({
      name: "broken.png",
      mimeType: "image/png",
      buffer: Buffer.from("not an image"),
    });
    await expect(dialog.getByText("That image couldn't be read")).toBeVisible();
    // A 1×1 transparent PNG, picked through the button as a visitor would
    const chooser = page.waitForEvent("filechooser");
    await dialog.getByRole("button", { name: "Add image" }).click();
    await (
      await chooser
    ).setFiles({
      name: "my-phone-screenshot.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
    await expect(dialog.getByText("my-phone-screenshot.png")).toBeVisible();
    await expect(dialog.getByText("That image couldn't be read")).toBeHidden();

    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: SEND_TIMEOUT });
    expect(requests).toEqual([
      {
        message: "See my screenshot",
        link: expect.any(String),
        screen: expect.any(String),
        images: [expect.stringMatching(/^data:image\/jpeg;base64,/)],
      },
    ]);
  });

  test("a stalled screenshot image does not block feedback or leave its request running", async ({
    page,
  }) => {
    await page.route(/\/sprites\//, route =>
      route.fulfill({
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "base64",
        ),
      }),
    );
    const requests: Record<string, unknown>[] = [];
    await page.route("/api/feedback", route => {
      requests.push(route.request().postDataJSON());
      return route.fulfill({ status: 204 });
    });
    await page.evaluate(() => {
      const originalFetch = window.fetch.bind(window);
      const captureRequests = { pending: 0, aborted: 0 };
      Reflect.set(window, "captureRequests", captureRequests);
      window.fetch = (input, init) => {
        if (!String(input).startsWith("/showdown-sprites/"))
          return originalFetch(input, init);
        captureRequests.pending += 1;
        return new Promise<Response>((_, reject) => {
          const abort = () => {
            captureRequests.pending -= 1;
            captureRequests.aborted += 1;
            reject(new DOMException("Request aborted", "AbortError"));
          };
          if (init?.signal?.aborted) abort();
          else init?.signal?.addEventListener("abort", abort, { once: true });
        });
      };
    });
    await selectPokemon(page, "Wobbuffet");
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog.getByLabel("Your feedback").fill("The image server stalled");
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: SEND_TIMEOUT });
    expect(requests).toEqual([
      {
        message: "The image server stalled",
        link: expect.stringContaining("?team="),
        screen: expect.any(String),
      },
    ]);
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, "captureRequests")))
      .toEqual({ pending: 0, aborted: expect.any(Number) });
    expect(
      await page.evaluate(() => Reflect.get(window, "captureRequests").aborted),
    ).toBeGreaterThan(0);
  });

  test("offers the email address when sending fails", async ({ page }) => {
    await page.route("/api/feedback", route => route.fulfill({ status: 502 }));
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog.getByLabel("Your feedback").fill("Hello");
    await dialog.getByRole("button", { name: "Send", exact: true }).click();

    await expect(dialog.getByRole("alert")).toContainText("couldn't be sent", {
      timeout: SEND_TIMEOUT,
    });
    await expect(
      dialog.getByRole("link", { name: "jeffery124@gmail.com" }),
    ).toHaveAttribute("href", "mailto:jeffery124@gmail.com");
    await expect(dialog.getByLabel("Your feedback")).toHaveValue("Hello");
  });
});
