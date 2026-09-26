import type { NameTranslations } from "@/types";
import en, { type Messages } from "./en";
import { englishNames, localizedNames, type Names } from "./names";
import type { Locale } from "./locales";

// One language: its UI text and its data names
export interface Translation {
  locale: Locale;
  t: Messages;
  names: Names;
}

export const english: Translation = {
  locale: "en",
  t: en,
  names: englishNames,
};

type Pack = [{ default: Messages }, { default: NameTranslations }];

// Each language loads on demand, so the bundle only carries English
const packs: Record<Exclude<Locale, "en">, () => Promise<Pack>> = {
  ja: () =>
    Promise.all([
      import("./ja"),
      import("@/data/translations/ja.json", { with: { type: "json" } }),
    ]),
  ko: () =>
    Promise.all([
      import("./ko"),
      import("@/data/translations/ko.json", { with: { type: "json" } }),
    ]),
  "zh-Hant": () =>
    Promise.all([
      import("./zh-hant"),
      import("@/data/translations/zh-Hant.json", { with: { type: "json" } }),
    ]),
  "zh-Hans": () =>
    Promise.all([
      import("./zh-hans"),
      import("@/data/translations/zh-Hans.json", { with: { type: "json" } }),
    ]),
  fr: () =>
    Promise.all([
      import("./fr"),
      import("@/data/translations/fr.json", { with: { type: "json" } }),
    ]),
  de: () =>
    Promise.all([
      import("./de"),
      import("@/data/translations/de.json", { with: { type: "json" } }),
    ]),
  es: () =>
    Promise.all([
      import("./es"),
      import("@/data/translations/es.json", { with: { type: "json" } }),
    ]),
  it: () =>
    Promise.all([
      import("./it"),
      import("@/data/translations/it.json", { with: { type: "json" } }),
    ]),
};

export async function loadTranslation(locale: Locale): Promise<Translation> {
  if (locale === "en") return english;
  const [messages, names] = await packs[locale]();
  return {
    locale,
    t: messages.default,
    names: localizedNames(names.default),
  };
}
