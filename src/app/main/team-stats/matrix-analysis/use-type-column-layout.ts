import { useLayoutEffect, useRef, useState } from "react";

export default function useTypeColumnLayout(
  labelKey: string,
  slotCount: number,
) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [fit, setFit] = useState({
    hasIcon: false,
    showFullName: false,
    columnWidth: 44,
  });

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const labels = [
      ...table.querySelectorAll<HTMLElement>("[data-type-label]"),
    ];
    let active = true;
    const update = () => {
      if (!active || !labels.length) return;
      const widths = labels.map(label => {
        const style = getComputedStyle(label);
        const cellStyle = getComputedStyle(label.closest("th") ?? label);
        const padding =
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight) +
          parseFloat(cellStyle.paddingLeft) +
          parseFloat(cellStyle.paddingRight);
        const name = label.querySelector<HTMLElement>("[data-type-name]");
        const abbreviation = label.querySelector<HTMLElement>(
          "[data-type-abbreviation]",
        );
        const icon = 14 + parseFloat(style.columnGap);
        return {
          abbreviation:
            (abbreviation?.getBoundingClientRect().width ?? 0) + padding,
          withIcon:
            (abbreviation?.getBoundingClientRect().width ?? 0) + icon + padding,
          fullName: (name?.getBoundingClientRect().width ?? 0) + icon + padding,
        };
      });
      const abbreviationWidth = Math.max(
        44,
        Math.ceil(Math.max(...widths.map(width => width.abbreviation))),
      );
      const iconWidth = Math.ceil(
        Math.max(...widths.map(width => width.withIcon)),
      );
      const fullNameWidth = Math.ceil(
        Math.max(...widths.map(width => width.fullName)),
      );
      // Reserve 40px for each Pokemon icon and the score column.
      const available = table.clientWidth - (slotCount + 1) * 40;
      const hasIcon = available >= iconWidth;
      const showFullName = hasIcon && available >= fullNameWidth;
      const columnWidth =
        showFullName ? fullNameWidth
        : hasIcon ? iconWidth
        : abbreviationWidth;
      setFit(previous =>
        (
          previous.hasIcon === hasIcon &&
          previous.showFullName === showFullName &&
          previous.columnWidth === columnWidth
        ) ?
          previous
        : { hasIcon, showFullName, columnWidth },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(table);
    for (const label of labels)
      for (const text of label.querySelectorAll(
        "[data-type-name], [data-type-abbreviation]",
      ))
        observer.observe(text);
    update();
    document.fonts?.ready.then(update);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [labelKey, slotCount]);

  return { tableRef, ...fit };
}
