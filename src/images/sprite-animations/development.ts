import manifest from "./manifest.json";
import type { Generation } from "@/types";

const animations: Record<string, { file: string; duration: number }> = manifest;

export function getSpriteAnimation(
  pokemon: string,
  generation: Generation,
  shiny: boolean,
) {
  const animation =
    animations[`${generation}${shiny ? "-shiny" : ""}/${pokemon}`];
  return animation ?
      {
        src: new URL(animation.file, import.meta.url).href,
        duration: animation.duration,
      }
    : undefined;
}
