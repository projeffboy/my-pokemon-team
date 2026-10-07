import type { SyntheticEvent } from "react";
import { useTheme } from "@mui/material/styles";

export default function useDiceRoll() {
  const { transitions } = useTheme();

  return ({ currentTarget }: SyntheticEvent<HTMLElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const icon = currentTarget.querySelector("svg");
    if (!icon) return;
    for (const animation of icon.getAnimations({ subtree: true }))
      animation.cancel();
    const dice = [...icon.querySelectorAll<SVGElement>("[data-die]")];
    const frames = [
      [0, 0, 0],
      [-2, -3, -13],
      [2, -3, 13],
      [-1, -1, -8],
      [1, 0, 5],
      [0, 0, 0],
    ] as const;
    (dice.length ? dice : [icon]).forEach((die, index) => {
      const direction = index % 2 ? -1 : 1;
      die.animate(
        frames.map(([x, y, angle]) => ({
          transform: `translate(${x * direction}px, ${y}px) rotate(${angle * direction}deg)`,
        })),
        {
          duration: 520,
          delay: index * 35,
          easing: transitions.easing.easeInOut,
        },
      );
    });
  };
}
