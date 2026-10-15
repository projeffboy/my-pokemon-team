// Temporary diagnostic for the flaky iPhone Legends: Z-A link test; not for merging
import { test, expect } from "fixtures";

const toBase64Url = (text: string) => Buffer.from(text).toString("base64url");

test.beforeEach(async ({ page }) => {
  page.on("console", message => {
    if (message.text().startsWith("[diag]")) console.log(message.text());
  });
  await page.addInitScript(() => {
    const t0 = performance.now();
    const log = (text: string) =>
      console.log(
        `[diag] ${Math.round(performance.now() - t0)}ms ${location.search.slice(0, 40)} ${text}`,
      );
    const nav = performance.getEntriesByType("navigation")[0];
    log(`load type=${nav && "type" in nav ? String(nav.type) : "?"}`);
    for (const type of ["input", "change"])
      document.addEventListener(
        type,
        event => {
          const target = event.target as HTMLInputElement;
          log(
            `${type} class=${String(target.className).slice(0, 60)} value=${target.value} trusted=${event.isTrusted} stack=${(new Error().stack ?? "").split("\n").slice(1, 12).join(" | ")}`,
          );
        },
        true,
      );
    for (const name of ["pushState", "replaceState"] as const) {
      const original = history[name].bind(history);
      history[name] = (...args: Parameters<History["pushState"]>) => {
        log(
          `${name} ${String(args[2]).slice(0, 60)} stack=${(new Error().stack ?? "").split("\n").slice(1, 8).join(" | ")}`,
        );
        return original(...args);
      };
    }
    let lastValue: string | undefined;
    let lastSearch = location.search;
    setInterval(() => {
      const input = document.querySelector<HTMLInputElement>(
        "header .MuiSelect-nativeInput",
      );
      const name = document.querySelector<HTMLInputElement>(
        '[aria-label="Pokemon 1\'s name"]',
      );
      if (input?.value !== lastValue || location.search !== lastSearch) {
        lastValue = input?.value;
        lastSearch = location.search;
        log(`state select=${lastValue} name=${name?.value}`);
      }
    }, 20);
  });
});

test("diagnose Legends: Z-A links on first load", async ({ page }) => {
  const team = toBase64Url("Inkay\n- Psycho Cut");
  console.log("[diag] --- goto link");
  await page.goto(`/?game=legends-za&team=${team}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByLabel("Pokemon 1's name")).toHaveValue("Inkay");
  const generation = page.getByRole("combobox", { name: "Generation" });
  try {
    await expect(generation).toContainText(/Z-A/);
  } finally {
    console.log(
      `[diag] end url=${page.url()} select=${await generation.textContent()} snackbar=${await page.getByRole("alert").allTextContents()}`,
    );
  }
});
