import { test, expect } from "fixtures";
import { selectPokemon } from "helper";

// Sending waits for the page screenshot, which takes WebKit several seconds
const SEND_TIMEOUT = 15000;

type CompressionControls = {
  auditCompressions: Record<string, (data: string) => void>;
};

test.describe("Feedback Dialog - Unit Tests", () => {
  for (const status of [204, 502]) {
    test(`ignores a ${status} response after cancelling and reopening`, async ({
      page,
    }) => {
      let finish!: () => void;
      const pending = new Promise<void>(resolve => {
        finish = resolve;
      });
      let started!: () => void;
      const requested = new Promise<void>(resolve => {
        started = resolve;
      });
      await page.route("/api/feedback", async route => {
        started();
        await pending;
        await route.fulfill({ status });
      });
      await page.getByRole("button", { name: "Send feedback" }).click();
      const dialog = page.getByRole("dialog", { name: "Send Feedback" });
      await dialog.getByLabel("Your feedback").fill("First draft");
      await dialog.getByLabel("Attach a screenshot of the page").uncheck();
      await dialog.getByRole("button", { name: "Send", exact: true }).click();
      await requested;
      await expect(dialog.getByLabel("Your feedback")).toBeDisabled();
      await expect(dialog.getByLabel("Your email (optional)")).toBeDisabled();
      await expect(dialog.getByLabel("Attach my team link")).toBeDisabled();
      await expect(
        dialog.getByLabel("Attach a screenshot of the page"),
      ).toBeDisabled();
      await expect(
        dialog.getByRole("button", { name: "Add image" }),
      ).toBeDisabled();
      await dialog.getByRole("button", { name: "Cancel" }).click();
      await page.getByRole("button", { name: "Send feedback" }).click();
      await dialog.getByLabel("Your feedback").fill("New draft");
      const responded = page.waitForResponse("/api/feedback");
      finish();
      await responded;
      await expect(dialog.getByLabel("Your feedback")).toHaveValue("New draft");
      await expect(dialog.getByRole("alert")).toBeHidden();
      await expect(
        page.getByText("Thanks! Your feedback was sent."),
      ).toBeHidden();
    });
  }

  test("merges concurrent image selections without restoring deleted attachments", async ({
    page,
  }) => {
    await page.route("**/feedback-dialog/compress-image.ts*", route =>
      route.fulfill({
        contentType: "application/javascript",
        body: "export function compressImage(file) { return new Promise(resolve => { (window.auditCompressions ??= {})[file.name] = resolve; }); }",
      }),
    );
    await page.reload();
    await page.getByRole("button", { name: "Send feedback" }).click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    const send = dialog.getByRole("button", { name: "Send", exact: true });
    await dialog.getByLabel("Your feedback").fill("Attachments");
    const select = async (name: string) => {
      await dialog.locator("input[type=file]").setInputFiles({
        name,
        mimeType: "image/png",
        buffer: Buffer.from("mocked image"),
      });
      await expect
        .poll(() =>
          page.evaluate(
            name =>
              Boolean(
                (window as unknown as CompressionControls).auditCompressions?.[
                  name
                ],
              ),
            name,
          ),
        )
        .toBe(true);
    };
    const finish = (name: string) =>
      page.evaluate(
        name =>
          (window as unknown as CompressionControls).auditCompressions[name](
            "data:image/jpeg;base64,aW1hZ2U=",
          ),
        name,
      );
    await select("first.png");
    await select("second.png");
    await expect(send).toBeDisabled();
    await finish("first.png");
    await expect(dialog.getByText("first.png")).toBeVisible();
    await expect(send).toBeDisabled();
    await finish("second.png");
    await expect(dialog.getByText("second.png")).toBeVisible();
    await expect(send).toBeEnabled();
    await select("third.png");
    await dialog
      .getByText("first.png")
      .locator("..")
      .getByTestId("CancelIcon")
      .click();
    await finish("third.png");
    await expect(dialog.getByText("first.png")).toBeHidden();
    await expect(dialog.getByText("second.png")).toBeVisible();
    await expect(dialog.getByText("third.png")).toBeVisible();
    await expect(send).toBeEnabled();
    let finishSend!: () => void;
    const pending = new Promise<void>(resolve => {
      finishSend = resolve;
    });
    await page.route("/api/feedback", async route => {
      await pending;
      await route.fulfill({ status: 204 });
    });
    await dialog.getByLabel("Attach a screenshot of the page").uncheck();
    await send.click();
    await expect(dialog.getByTestId("CancelIcon")).toHaveCount(0);
    finishSend();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Send feedback" }).click();
    await expect(dialog.getByText("second.png")).toBeHidden();
    await expect(dialog.getByText("third.png")).toBeHidden();
  });

  test("sends the message, reply address, link, and screenshot", async ({
    page,
  }) => {
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

for (const address of ["trainer.example.com", "trainer@"]) {
  test(`blocks invalid reply address ${address} and allows its correction`, async ({
    page,
  }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route("/api/feedback", async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status: 204 });
    });
    await page
      .getByRole("button", { name: "Send feedback", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog
      .getByLabel("Your feedback", { exact: true })
      .fill("Please reply about my team");
    await dialog.getByLabel("Attach a screenshot of the page").uncheck();
    const email = dialog.getByLabel("Your email (optional)", { exact: true });
    await email.fill(address);
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(
      dialog.getByText("Enter a valid email address, or leave it empty."),
    ).toBeVisible();
    expect(requests).toHaveLength(0);
    await email.fill("trainer+team@example.com");
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(dialog).toBeHidden();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.email).toBe("trainer+team@example.com");
  });
}

for (const address of ["", "   "]) {
  test(`feedback accepts an ${address ? "whitespace-only" : "empty"} optional reply address`, async ({
    page,
  }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route("/api/feedback", async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status: 204 });
    });
    await page
      .getByRole("button", { name: "Send feedback", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Send Feedback" });
    await dialog
      .getByLabel("Your feedback", { exact: true })
      .fill("Feedback without a reply");
    await dialog
      .getByLabel("Your email (optional)", { exact: true })
      .fill(address);
    await dialog.getByLabel("Attach a screenshot of the page").uncheck();
    await dialog.getByRole("button", { name: "Send", exact: true }).click();
    await expect(dialog).toBeHidden();
    expect(requests).toHaveLength(1);
    expect(requests[0]).not.toHaveProperty("email");
  });
}
