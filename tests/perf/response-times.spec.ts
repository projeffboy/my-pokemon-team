import {
  test,
  expect,
  devices,
  type Browser,
  type Page,
} from "@playwright/test";

// Times REQ-PERF-1 to 3 (section 3.3 of the SyRS) on the production build, on an
// emulated mid-range phone, and prints each moment's 95th percentile

const RUNS = Number(process.env.PERF_RUNS ?? 20);
// Lighthouse's mobile profile slows the CPU 4x and uses its Slow 4G network, set
// per request as DevTools sets it. Fast 4G is DevTools' preset of that name.
const CPU_SLOWDOWN = Number(process.env.PERF_CPU_SLOWDOWN ?? 4);
const NETWORKS = {
  slow4g: {
    latency: 562.5,
    downloadThroughput: 188_744,
    uploadThroughput: 86_400,
  },
  fast4g: {
    latency: 165,
    downloadThroughput: 1_012_500,
    uploadThroughput: 168_750,
  },
};
const NETWORK = process.env.PERF_NETWORK ?? "slow4g";
// The SyRS's proposed limits, in milliseconds
const TARGETS = { analysis: 100, list: 200, shareLink: 3000 };

// Picked into the slots in turn
const PICKS = [
  "Hydreigon",
  "Talonflame",
  "Breloom",
  "Azumarill",
  "Ferrothorn",
  "Weavile",
  "Hatterene",
  "Krookodile",
  "Volcarona",
  "Dondozo",
];

const SHARED_TEAM = `Dragapult @ Choice Specs
Ability: Infiltrator
Tera Type: Ghost
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Shadow Ball
- Draco Meteor
- Flamethrower
- U-turn

Tinkaton @ Leftovers
Ability: Mold Breaker
EVs: 252 HP / 4 Atk / 252 SpD
Careful Nature
- Gigaton Hammer
- Stealth Rock
- Knock Off
- Play Rough

Amoonguss @ Rocky Helmet
Ability: Regenerator
EVs: 252 HP / 252 Def / 4 SpD
Bold Nature
- Spore
- Giga Drain
- Sludge Bomb
- Clear Smog

Annihilape @ Leftovers
Ability: Defiant
EVs: 252 HP / 4 Atk / 252 SpD
Careful Nature
- Rage Fist
- Drain Punch
- Bulk Up
- Taunt

Kilowattrel @ Heavy-Duty Boots
Ability: Volt Absorb
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Hurricane
- Volt Switch
- Roost

Baxcalibur @ Loaded Dice
Ability: Thermal Exchange
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Glaive Rush
- Icicle Spear
- Scale Shot
- Earthquake`;

const openPhone = async (browser: Browser, baseURL?: string) => {
  const network = NETWORKS[NETWORK as keyof typeof NETWORKS];
  if (!network) throw new Error(`Unknown PERF_NETWORK: ${NETWORK}`);
  const context = await browser.newContext({
    ...devices["Galaxy S24"],
    baseURL,
  });
  const page = await context.newPage();
  // Blocking through the protocol, unlike page.route, keeps the browser's cache.
  // The preview server forwards /showdown-sprites/ to Showdown.
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", {
    urls: [
      "*://cdn.intergient.com/*",
      "*://play.pokemonshowdown.com/*",
      "*://*/showdown-sprites/*",
    ],
  });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    ...network,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_SLOWDOWN });
  return page;
};

// Runs in the page. Times from the next touch to the paint after it first changes
// the region, or after it first shows a list option.
const armTimer = (region: Element | null) => {
  const root = document.documentElement;
  delete root.dataset.perfMs;
  let start: number | undefined;
  addEventListener("pointerdown", event => (start = event.timeStamp), {
    capture: true,
    once: true,
  });
  const observer = new MutationObserver(() => {
    if (start === undefined) return;
    if (!region && !document.querySelector('[role="option"]')) return;
    observer.disconnect();
    requestAnimationFrame(() => {
      const { port1, port2 } = new MessageChannel();
      port1.onmessage = () =>
        (root.dataset.perfMs = String(performance.now() - (start ?? 0)));
      port2.postMessage(null);
    });
  });
  observer.observe(region ?? document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
};

// Runs in the page from its start. Notes the paint at which every slot tab names
// its pokemon and the analysis has a score other than 0.
const watchForTeam = (tabLabels: string[]) => {
  const check = () => {
    const tabs = new Set(
      [...document.querySelectorAll('[role="tab"]')].map(tab => tab.ariaLabel),
    );
    const analysed = [
      ...document.querySelectorAll('[aria-label*=" score: "]'),
    ].some(score => !score.ariaLabel?.endsWith(": 0"));
    if (!analysed || tabLabels.some(label => !tabs.has(label))) {
      requestAnimationFrame(check);
      return;
    }
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () =>
      (document.documentElement.dataset.perfMs = String(performance.now()));
    port2.postMessage(null);
  };
  requestAnimationFrame(check);
};

const timing = async (page: Page) => {
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-perf-ms", /\d/, {
    timeout: 60_000,
  });
  return Number(await root.getAttribute("data-perf-ms"));
};

const report = (moment: string, times: number[], target: number) => {
  const sorted = times.toSorted((a, b) => a - b);
  const at = (percent: number) =>
    Math.round(sorted[Math.ceil((percent / 100) * sorted.length) - 1] ?? NaN);
  const summary = `${moment}: median ${at(50)} ms, 95th percentile ${at(95)} ms, slowest ${at(100)} ms (target ${target} ms; ${times.length} runs, ${CPU_SLOWDOWN}x CPU, ${NETWORK})`;
  console.log(summary);
  test.info().annotations.push({ type: "timing", description: summary });
  expect.soft(at(95), moment).toBeLessThanOrEqual(target);
};

test("REQ-PERF-1 and 2: a team is built", async ({ browser, baseURL }) => {
  const listTimes: number[] = [];
  const analysisTimes: number[] = [];
  // Each session builds a team of six on a page that has finished loading
  for (let session = 0; listTimes.length < RUNS; session++) {
    const page = await openPhone(browser, baseURL);
    await page.goto("/", { waitUntil: "networkidle" });
    const region = await page
      .getByRole("region", { name: "Team Defence" })
      .elementHandle();
    for (let slot = 0; slot < 6; slot++) {
      const pokemon = PICKS[(session * 6 + slot) % PICKS.length] ?? "";
      await page
        .getByRole("tab", { name: new RegExp(`^Pokemon ${slot + 1} \\(`) })
        .tap();
      const input = page.getByLabel(`Pokemon ${slot + 1}'s name`);
      await page.evaluate(armTimer, null);
      await input.tap();
      listTimes.push(await timing(page));
      await input.fill(pokemon);
      await page.evaluate(armTimer, region);
      await page.getByRole("option", { name: pokemon, exact: true }).tap();
      analysisTimes.push(await timing(page));
    }
    await page.context().close();
  }
  report("REQ-PERF-1 analysis after a change", analysisTimes, TARGETS.analysis);
  report("REQ-PERF-2 pokemon list", listTimes, TARGETS.list);
});

test("REQ-PERF-3: a share link shows its team", async ({
  browser,
  baseURL,
}) => {
  const team = Buffer.from(SHARED_TEAM).toString("base64url");
  const tabLabels = [...SHARED_TEAM.matchAll(/^(\S+) @/gm)].map(
    ([, pokemon], i) => `Pokemon ${i + 1} (${pokemon})`,
  );
  const times: number[] = [];
  for (let run = 0; run < RUNS; run++) {
    // A new context has an empty cache
    const page = await openPhone(browser, baseURL);
    await page.addInitScript(watchForTeam, tabLabels);
    await page.goto(`/?team=${team}`);
    times.push(await timing(page));
    await page.context().close();
  }
  report("REQ-PERF-3 share link", times, TARGETS.shareLink);
});
