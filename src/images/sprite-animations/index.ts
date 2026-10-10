import manifest from "./manifest.json";
import type { Generation } from "@/types";

const images = import.meta.glob<string>("./**/*.{gif,png}", {
  eager: true,
  query: "?url&no-inline",
  import: "default",
});
const animations: Record<string, { file: string; duration: number }> = manifest;

export function getSpriteAnimation(
  pokemon: string,
  generation: Generation,
  shiny: boolean,
) {
  const animation =
    animations[`${generation}${shiny ? "-shiny" : ""}/${pokemon}`];
  const src = animation && images[`./${animation.file}`];
  return src && animation ? { src, duration: animation.duration } : undefined;
}
