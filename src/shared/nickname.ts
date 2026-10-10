import type { Locale } from "@/i18n/locales";
import type { Generation } from "@/types";

export function nicknameLimit(generation: Generation, locale: Locale = "en") {
  const short =
    locale === "ja" ||
    locale === "ko" ||
    (generation >= 7 && (locale === "zh-Hans" || locale === "zh-Hant"));
  return (
    generation <= 5 ?
      short ? 5
      : 10
    : short ? 6
    : 12
  );
}

export const shortenNickname = (nickname: string, limit: number) =>
  nickname.slice(0, limit).replace(/[\uD800-\uDBFF]$/, "");
