import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  List,
  RowComponentProps,
  ListImperativeAPI,
  useDynamicRowHeight,
} from "react-window";
import PokemonIcon from "./PokemonIcon";

const LISTBOX_PADDING = 0; // px
const ITEM_SIZE = 48;

interface SelectOption {
  value: string;
  label: string;
}

// [props, option] tuples produced by PokemonInputSelect's renderOption
type ItemData = Array<[React.HTMLAttributes<HTMLLIElement>, SelectOption]>;

function RowComponent({
  index,
  itemData,
  pokemonProperty,
  style,
}: RowComponentProps & {
  itemData: ItemData;
  pokemonProperty: string;
}) {
  const [optionProps, option] = itemData[index];
  const { key, ...otherOptionProps } =
    optionProps as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
  const hasIcon = ["name", "item"].includes(pokemonProperty);

  return (
    <Typography
      key={key}
      component="li"
      {...otherOptionProps}
      style={{
        ...style,
        top: ((style.top as number | undefined) ?? 0) + LISTBOX_PADDING,
        paddingInline: hasIcon ? 4 : 8,
      }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      {hasIcon && (
        <PokemonIcon pokemonProperty={pokemonProperty} value={option.value} />
      )}
      <span style={{ flex: 1, paddingLeft: 2 }}>{option.label}</span>
    </Typography>
  );
}

// Virtualizes the Autocomplete's option list with react-window so only
// the visible rows are rendered (matches MUI's Autocomplete virtualization pattern)
const VirtualizedListbox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement> & {
    pokemonProperty: string;
    selectedValue: string;
    internalListRef: React.Ref<ListImperativeAPI>;
  }
>(function VirtualizedListbox(
  { children, pokemonProperty, selectedValue, internalListRef, ...other },
  ref,
) {
  const itemData = children as ItemData;
  const itemCount = itemData.length;
  // Rows with wrapped (two-line) labels measure taller than single-line rows;
  // resetting the cache (via `key`) whenever the option list changes
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ITEM_SIZE,
    key: itemCount,
  });

  // The list is freshly mounted each time the popup opens, so jump to the
  // currently selected row (it may be far outside the initially rendered rows)
  React.useEffect(() => {
    const index = itemData.findIndex(
      ([, option]) => option.value === selectedValue,
    );
    if (index === -1 || !internalListRef || !("current" in internalListRef)) {
      return;
    }
    // react-window's imperative API object exists synchronously, but its
    // internal DOM element ref isn't attached until just after mount, so
    // scrollToRow silently no-ops if called immediately. Defer to the next
    // animation frame to ensure the underlying element is ready.
    const frame = requestAnimationFrame(() => {
      internalListRef.current?.scrollToRow({ index, align: "auto" });
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Uses the measured average row height (rows are shorter than ITEM_SIZE on
  // wider screens, where MUI's option minHeight is no longer forced to 48px)
  // so the popup doesn't reserve extra empty space below the rows
  const getHeight = () => {
    const rowHeight = dynamicRowHeight.getAverageRowHeight();
    return Math.min(itemCount, 8) * rowHeight;
  };

  const { className, style, ...otherProps } = other;

  return (
    <div ref={ref} {...otherProps}>
      <List
        className={className}
        listRef={internalListRef}
        key={itemCount}
        rowCount={itemCount}
        rowHeight={dynamicRowHeight}
        rowComponent={RowComponent}
        rowProps={{ itemData, pokemonProperty }}
        style={{
          height: getHeight() + 2 * LISTBOX_PADDING,
          width: "100%",
        }}
        overscanCount={5}
        tagName="ul"
      />
    </div>
  );
});

export default VirtualizedListbox;
