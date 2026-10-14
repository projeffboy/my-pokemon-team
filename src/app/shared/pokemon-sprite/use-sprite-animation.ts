import { useEffect, useState } from "react";
import type { Generation } from "@/types";

type SpriteAnimations = typeof import("@/images/sprite-animations");
let animations: SpriteAnimations | undefined;
let loading: Promise<SpriteAnimations> | undefined;

// The Gen 2-4 animations are a list of over two thousand files, so it loads
// with the first sprite that can play one
export function useSpriteAnimation(
  pokemon: string,
  generation: Generation,
  shiny: boolean,
  eligible: boolean,
) {
  const [, setLoaded] = useState(!!animations);
  useEffect(() => {
    if (!eligible || animations) return;
    let unmounted = false;
    (loading ??= import("@/images/sprite-animations")).then(
      module => {
        animations = module;
        if (!unmounted) setLoaded(true);
      },
      () => {
        // The sprite stays still, and the next one tries again
        loading = undefined;
      },
    );
    return () => {
      unmounted = true;
    };
  }, [pokemon, generation, shiny, eligible]);

  return eligible ?
      animations?.getSpriteAnimation(pokemon, generation, shiny)
    : undefined;
}
