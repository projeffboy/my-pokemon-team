import {
  useRef,
  type SyntheticEvent,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { useTheme } from "@mui/material/styles";

export default function useDiceRoll() {
  const { transitions } = useTheme();
  const pressed = useRef<HTMLElement | null>(null);

  const roll = ({ currentTarget }: SyntheticEvent<HTMLElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    const icon = currentTarget.querySelector("svg");
    if (!icon) return [];
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
    return (dice.length ? dice : [icon]).map((die, index) => {
      const direction = index % 2 ? -1 : 1;
      return die.animate(
        frames.map(([x, y, angle]) => ({
          transform: `translate(${x * direction}px, ${y}px) rotate(${angle * direction}deg)`,
        })),
        {
          duration: 520,
          easing: transitions.easing.easeOut,
        },
      );
    });
  };

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || !event.isPrimary) return;
      pressed.current = event.currentTarget;
      roll(event);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.repeat || (event.key !== " " && event.key !== "Enter")) return;
      pressed.current = event.currentTarget;
      roll(event);
    },
    onPointerCancel: () => {
      pressed.current = null;
    },
    onBlur: () => {
      pressed.current = null;
    },
    onClick: (event: SyntheticEvent<HTMLElement>, action: () => void) => {
      const animations =
        pressed.current === event.currentTarget ?
          (event.currentTarget
            .querySelector("svg")
            ?.getAnimations({ subtree: true }) ?? [])
        : roll(event);
      pressed.current = null;
      if (!animations.length) {
        action();
        return;
      }
      // Paint a moving frame before randomization can block rendering.
      void Promise.all(
        animations.map(animation => animation.ready.catch(() => undefined)),
      ).then(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setTimeout(action, 0);
          }),
        );
      });
    },
  };
}
