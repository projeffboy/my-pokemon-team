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
const ITEM_SIZE = 48; // Reduced after removing padding

interface SelectOption {
  value: string;
  label: string;
}

// [props, option] tuples produced by PokemonInputSelect's renderOption
type ItemData = Array<[React.HTMLAttributes<HTMLLIElement>, SelectOption]>;

function RowComponent({
  index,
  itemData,
  iconProperty,
  style,
}: RowComponentProps & {
  itemData: ItemData;
  iconProperty: string;
}) {
  const [optionProps, option] = itemData[index];
  const { key, ...otherOptionProps } =
    optionProps as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
  const inlineStyle = {
    ...style,
    top: ((style.top as number | undefined) ?? 0) + LISTBOX_PADDING,
  };

  return (
    <Typography
      key={key}
      component="li"
      {...otherOptionProps}
      style={inlineStyle}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      <PokemonIcon pokemonProperty={iconProperty} value={option.value} />
      <span style={{ flex: 1 }}>{option.label}</span>
    </Typography>
  );
}

// Virtualizes the Autocomplete's option list with react-window so only
// the visible rows are rendered (matches MUI's Autocomplete virtualization pattern)
const VirtualizedListbox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement> & {
    iconProperty: string;
    selectedValue: string;
    internalListRef: React.Ref<ListImperativeAPI>;
  }
>(function VirtualizedListbox(props, ref) {
  const { children, iconProperty, selectedValue, internalListRef, ...other } =
    props;
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

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * ITEM_SIZE;
    }
    return itemCount * ITEM_SIZE;
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
        rowProps={{ itemData, iconProperty }}
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
