// The site's languages: English, the eight other languages of the Pokemon games so far, and
// Brazilian Portuguese, which the games gain in 2027
export const LOCALES = [
  "en",
  "ja",
  "ko",
  "zh-Hans",
  "zh-Hant",
  "es",
  "fr",
  "de",
  "it",
  "pt-BR",
] as const;

export type Locale = (typeof LOCALES)[number];

// The languages with names in src/data/translations. PokeAPI has none in Portuguese yet, so
// its names stay English.
export type NamedLocale = Exclude<Locale, "en" | "pt-BR">;

export const DEFAULT_LOCALE: Locale = "en";

// Each language in its own name, as the language menu lists them
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
  "zh-Hant": "中文（繁體）",
  "zh-Hans": "中文（简体）",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  "pt-BR": "Português (Brasil)",
};

// A caption for the language button
export const LOCALE_CODES: Record<Locale, string> = {
  en: "EN",
  ja: "JA",
  ko: "KO",
  "zh-Hant": "繁中",
  "zh-Hans": "简中",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  "pt-BR": "PT",
};

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);

// The first supported language of the browser's preferences, e.g. ["zh-TW", "en-US"] => zh-Hant.
// Chinese picks the script from the region or script subtag, and defaults to Simplified.
// Every other language ignores the region, so Portugal's Portuguese gets Brazil's.
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const [primary = "", ...subtags] = language.toLowerCase().split("-");
    if (primary === "zh") {
      const traditional = subtags.some(tag =>
        ["hant", "tw", "hk", "mo"].includes(tag),
      );
      return traditional ? "zh-Hant" : "zh-Hans";
    }
    const locale = LOCALES.find(
      locale => locale.toLowerCase().split("-")[0] === primary,
    );
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}
