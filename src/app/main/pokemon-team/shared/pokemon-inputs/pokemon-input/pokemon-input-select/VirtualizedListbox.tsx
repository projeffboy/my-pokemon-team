import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import {
  List,
  RowComponentProps,
  useDynamicRowHeight,
  ListImperativeAPI,
} from "react-window";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { NameView } from "@/types";
import PokemonIcon from "@/app/main/shared/PokemonIcon";

const LISTBOX_PADDING = 0; // px
const ITEM_SIZE = 48;
export const GRID_COLUMNS = 5;
const GRID_ROW_SIZE = 40;

interface SelectOption {
  value: string;
  label: string;
}

// [props, option] tuples produced by PokemonInputSelect's renderOption
type ItemData = Array<[React.HTMLAttributes<HTMLLIElement>, SelectOption]>;

type OptionProps = React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };

function RowComponent({
  index,
  itemData,
  pokemonProperty,
  style,
}: RowComponentProps & {
  itemData: ItemData;
  pokemonProperty: string;
}) {
  const row = itemData[index];
  if (!row) return null;

  const [optionProps, option] = row;
  const { key, ...otherOptionProps } = optionProps as OptionProps;
  const hasIcon = ["name", "item"].includes(pokemonProperty);

  return (
    <Typography
      key={key}
      component="li"
      {...otherOptionProps}
      // eslint-disable-next-line no-restricted-syntax -- react-window positions each row
      style={{
        ...style,
        top: ((style.top as number | undefined) ?? 0) + LISTBOX_PADDING,
      }}
      sx={{ alignItems: "flex-start", wordBreak: "break-word" }}
    >
      {hasIcon && (
        <PokemonIcon pokemonProperty={pokemonProperty} value={option.value} />
      )}
      <Box component="span" sx={{ flex: 1, pl: 0.25 }}>
        {option.label}
      </Box>
    </Typography>
  );
}

// A row of the grid view: icons only, named for screen readers and the tooltip
function GridRowComponent({
  index,
  itemData,
  style,
}: RowComponentProps & { itemData: ItemData }) {
  const cells = itemData.slice(
    index * GRID_COLUMNS,
    (index + 1) * GRID_COLUMNS,
  );

  return (
    <Box
      // eslint-disable-next-line no-restricted-syntax -- react-window positions each row
      style={style}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
        px: 0.5,
      }}
    >
      {cells.map(([optionProps, option]) => {
        const { key, className, ...otherOptionProps } =
          optionProps as OptionProps;
        return (
          <Box
            key={key}
            component="li"
            className={className}
            {...otherOptionProps}
            aria-label={option.label}
            title={option.label}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: GRID_ROW_SIZE,
              borderRadius: 1,
              // Overrides the option class's list-row spacing
              "&&": { minHeight: 0, p: 0 },
            }}
          >
            <PokemonIcon pokemonProperty="name" value={option.value} />
          </Box>
        );
      })}
    </Box>
  );
}

// The Autocomplete's listbox slot only accepts list element props, so the
// select passes what the listbox needs through this context instead
export const VirtualizedListboxContext = React.createContext<{
  pokemonProperty: string;
  selectedValue: string;
  internalListRef: React.RefObject<ListImperativeAPI | null>;
} | null>(null);

// Virtualizes the Autocomplete's option list with react-window so only
// the visible rows are rendered (matches MUI's Autocomplete virtualization pattern).
// The Name dropdown can also show its options as a grid of icons.
const VirtualizedListbox = observer(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function VirtualizedListbox({ children, ...other }, ref) {
      const context = React.useContext(VirtualizedListboxContext);
      if (!context) {
        throw new Error(
          "VirtualizedListbox must be used within a VirtualizedListboxContext",
        );
      }
      const { pokemonProperty, selectedValue, internalListRef } = context;
      const isNameInput = pokemonProperty === "name";
      const isGrid = isNameInput && store.nameView === "grid";
      const itemData = children as ItemData;
      const itemCount = itemData.length;
      const rowCount = isGrid ? Math.ceil(itemCount / GRID_COLUMNS) : itemCount;
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
        if (index === -1) return;
        // react-window's imperative API object exists synchronously, but its
        // internal DOM element ref isn't attached until just after mount, so
        // scrollToRow silently no-ops if called immediately. Defer to the next
        // animation frame to ensure the underlying element is ready.
        const frame = requestAnimationFrame(() => {
          internalListRef.current?.scrollToRow({
            index: isGrid ? Math.floor(index / GRID_COLUMNS) : index,
            align: "auto",
          });
        });
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isGrid]);

      // Uses the measured average row height (rows are shorter than ITEM_SIZE on
      // wider screens, where MUI's option minHeight is no longer forced to 48px)
      // so the popup doesn't reserve extra empty space below the rows
      const getHeight = () => {
        if (isGrid) return Math.min(rowCount, 8) * GRID_ROW_SIZE;
        const rowHeight = dynamicRowHeight.getAverageRowHeight();
        return Math.min(itemCount, 8) * rowHeight;
      };

      const { className, style, ...otherProps } = other;

      return (
        <div ref={ref} {...otherProps}>
          {isNameInput && (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={store.nameView}
              onChange={(_event, view: NameView | null) => {
                if (view) store.nameView = view;
              }}
              // Keeps the focus, and so the popup, in the input
              onMouseDown={event => event.preventDefault()}
              aria-label="Name list view"
              sx={{ display: "flex", m: 0.5, "& > *": { flex: 1 } }}
            >
              <ToggleButton value="list" aria-label="List view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="Grid view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          {isGrid ?
            <List
              className={className}
              listRef={internalListRef}
              key={`grid-${itemCount}`}
              rowCount={rowCount}
              rowHeight={GRID_ROW_SIZE}
              rowComponent={GridRowComponent}
              rowProps={{ itemData }}
              // eslint-disable-next-line no-restricted-syntax -- react-window's own prop
              style={{ height: getHeight() }}
              overscanCount={3}
              tagName="ul"
            />
          : <List
              className={className}
              listRef={internalListRef}
              key={itemCount}
              rowCount={itemCount}
              rowHeight={dynamicRowHeight}
              rowComponent={RowComponent}
              rowProps={{ itemData, pokemonProperty }}
              // eslint-disable-next-line no-restricted-syntax -- react-window's own prop
              style={{ height: getHeight() + 2 * LISTBOX_PADDING }}
              overscanCount={5}
              tagName="ul"
            />
          }
        </div>
      );
    },
  ),
);

export default VirtualizedListbox;
