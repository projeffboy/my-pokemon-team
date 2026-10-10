import { useLayoutEffect, useRef, useState } from "react";
import { useSetTypeIcons } from "@/app/main/shared/TypeIconContext";
import { useBreakpoint } from "@/app/shared/WidthContext";

export default function useTypeLabelLayout(labelKey: string) {
  const gridRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();
  const setTypeIcons = useSetTypeIcons();
  const [fit, setFit] = useState({
    icon: false,
    fullName: false,
    chipWidth: 0,
  });

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const labels = [...grid.querySelectorAll<HTMLElement>("[data-type-label]")];
    const measurements = labels.flatMap(label => {
      const name = label.querySelector<HTMLElement>("[data-type-name]");
      const space = label.closest<HTMLElement>("[data-type-label-space]");
      const abbreviation = label.querySelector<HTMLElement>(
        "[data-type-abbreviation]",
      );
      return name && abbreviation && space ?
          [{ label, name, abbreviation, space }]
        : [];
    });
    if (!measurements.length) return;

    const update = () => {
      const widths = measurements.map(
        ({ label, name, abbreviation, space }) => {
          const style = getComputedStyle(label);
          const spaceStyle = getComputedStyle(space);
          return {
            available:
              space.getBoundingClientRect().width -
              parseFloat(spaceStyle.paddingLeft) -
              parseFloat(spaceStyle.paddingRight) -
              parseFloat(style.paddingLeft) -
              parseFloat(style.paddingRight),
            name: name.getBoundingClientRect().width,
            abbreviation: abbreviation.getBoundingClientRect().width,
            icon: 14 + parseFloat(style.columnGap),
            padding:
              parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
          };
        },
      );
      const icon =
        breakpoint !== "xxs" &&
        widths.every(
          width => width.abbreviation + width.icon <= width.available,
        );
      setTypeIcons(icon);
      const fullName =
        (breakpoint === "xxs" || breakpoint === "xs" || icon) &&
        widths.every(
          width => width.name + (icon ? width.icon : 0) <= width.available,
        );
      const chipWidth = Math.ceil(
        Math.max(
          ...widths.map(width => width.name + width.icon + width.padding),
        ),
      );
      setFit(previous =>
        (
          previous.icon === icon &&
          previous.fullName === fullName &&
          previous.chipWidth === chipWidth
        ) ?
          previous
        : { icon, fullName, chipWidth },
      );
    };

    const observer = new ResizeObserver(update);
    for (const { label, name, abbreviation, space } of measurements) {
      observer.observe(space);
      observer.observe(label);
      observer.observe(name);
      observer.observe(abbreviation);
    }
    update();
    return () => observer.disconnect();
  }, [breakpoint, labelKey, setTypeIcons]);

  return {
    gridRef,
    hasIcon: fit.icon,
    showFullName: fit.fullName,
    chipWidth: fit.chipWidth,
  };
}
