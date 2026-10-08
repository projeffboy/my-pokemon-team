import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  List,
  RowComponentProps,
  useDynamicRowHeight,
  ListImperativeAPI,
} from "react-window";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { isPokemonType, type NameView } from "@/types";
import { moveTypeIn } from "@/shared/generation-data";
import PokemonIcon from "@/app/shared/PokemonIcon";
import PokemonDexSprite from "./virtualized-listbox/PokemonDexSprite";
import { useTranslation } from "@/app/shared/TranslationContext";
import typeIcons from "@/images/type-icons";
import { useTypeIcons } from "@/app/main/shared/TypeIconContext";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";

const LISTBOX_PADDING = 0; // px
const ITEM_SIZE = 48;
export const gridColumns = (view: NameView) => (view === "big-grid" ? 3 : 5);
const GRID_ROW_SIZE = 40;
const BIG_GRID_ROW_SIZE = 96;
// The view toggle's top and bottom margins
const TOGGLE_MARGIN = 8;

interface SelectOption {
  value: string;
  label: string;
}

// [props, option] tuples produced by PokemonInputSelect's renderOption
type ItemData = Array<[React.HTMLAttributes<HTMLLIElement>, SelectOption]>;

type OptionProps = React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };

// A move's type, where the dropdown shows it
const MoveTypeIcon = observer(function MoveTypeIcon({
  move,
}: {
  move: string;
}) {
  const { t, names } = useTranslation();
  const hasTypeIcons = useTypeIcons();
  const type = moveTypeIn(move, store.currentTeam.generation);
  // A placeholder keeps the labels aligned for the few moves without a type
  if (!type || !isPokemonType(type)) {
    return <Box component="span" sx={{ width: 20, flexShrink: 0 }} />;
  }
  if (!hasTypeIcons) {
    return (
      <Box
        component="span"
        role="img"
        aria-label={names.type(type)}
        sx={{
          flexShrink: 0,
          mt: 0.25,
          px: 0.5,
          borderRadius: 0.5,
          fontSize: 10,
          fontWeight: 500,
          lineHeight: "16px",
          bgcolor: TYPE_COLORS[type],
          color: TYPE_TEXT_COLORS[type],
        }}
      >
        {t.typeAbbreviations[type]}
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={typeIcons[type]}
      alt={names.type(type)}
      sx={{ width: 20, height: 20, mt: 0.25, flexShrink: 0 }}
    />
  );
});

function RowComponent({
  index,
  itemData,
  pokemonProperty,
  showMoveTypes,
  style,
}: RowComponentProps & {
  itemData: ItemData;
  pokemonProperty: string;
  showMoveTypes: boolean;
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
      {showMoveTypes && <MoveTypeIcon move={option.value} />}
      <Box component="span" sx={{ flex: 1, pl: showMoveTypes ? 0.75 : 0.25 }}>
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
  columns,
  large,
}: RowComponentProps & {
  itemData: ItemData;
  columns: number;
  large: boolean;
}) {
  const cells = itemData.slice(index * columns, (index + 1) * columns);

  return (
    <Box
      // eslint-disable-next-line no-restricted-syntax -- react-window positions each row
      style={style}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
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
              height: large ? BIG_GRID_ROW_SIZE : GRID_ROW_SIZE,
              borderRadius: 1,
              // Overrides the option class's list-row spacing
              "&&": { minHeight: 0, p: 0 },
            }}
          >
            {large ?
              <PokemonDexSprite pokemon={option.value} />
            : <PokemonIcon pokemonProperty="name" value={option.value} />}
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
  // Whether the move options show their type, as the inputs do with the team tools
  showMoveTypes: boolean;
  selectedValue: string;
  internalListRef: React.RefObject<ListImperativeAPI | null>;
  // The room the popup has on the screen, measured when it opens
  popupMaxHeight?: number;
  nameListWidth: number;
} | null>(null);

// Virtualizes the Autocomplete's option list with react-window so only
// the visible rows are rendered (matches MUI's Autocomplete virtualization pattern).
// The Name dropdown can also show its options as a grid of icons.
const VirtualizedListbox = observer(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function VirtualizedListbox({ children, ...other }, ref) {
      const { t } = useTranslation();
      const context = React.useContext(VirtualizedListboxContext);
      if (!context) {
        throw new Error(
          "VirtualizedListbox must be used within a VirtualizedListboxContext",
        );
      }
      const {
        pokemonProperty,
        showMoveTypes,
        selectedValue,
        internalListRef,
        popupMaxHeight,
        nameListWidth,
      } = context;
      const isNameInput = pokemonProperty === "name";
      const isGrid = isNameInput && store.nameView !== "list";
      const isBigGrid = isNameInput && store.nameView === "big-grid";
      const columns = gridColumns(store.nameView);
      const gridRowSize = isBigGrid ? BIG_GRID_ROW_SIZE : GRID_ROW_SIZE;
      const itemData = children as ItemData;
      const itemCount = itemData.length;
      const rowCount = isGrid ? Math.ceil(itemCount / columns) : itemCount;
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
            index: isGrid ? Math.floor(index / columns) : index,
            align: "auto",
          });
        });
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isGrid, columns]);

      // The view toggle takes some of the popup's room
      const toggleRef = React.useRef<HTMLDivElement>(null);
      const [toggleHeight, setToggleHeight] = React.useState(0);
      React.useLayoutEffect(() => {
        setToggleHeight(toggleRef.current?.offsetHeight ?? 0);
      }, [isNameInput, isGrid]);

      // Uses the measured average row height (rows are shorter than ITEM_SIZE on
      // wider screens, where MUI's option minHeight is no longer forced to 48px)
      // so the popup doesn't reserve extra empty space below the rows. Up to
      // eight rows, or fewer where the screen has no room for them.
      const getHeight = () => {
        const rowHeight =
          isGrid ? gridRowSize : dynamicRowHeight.getAverageRowHeight();
        const rows = Math.min(isGrid ? rowCount : itemCount, 8) * rowHeight;
        if (popupMaxHeight === undefined) return rows;
        const chrome = isNameInput ? toggleHeight + TOGGLE_MARGIN : 0;
        return Math.min(rows, Math.max(0, popupMaxHeight - chrome));
      };

      const { className, style, ...otherProps } = other;

      return (
        <Box
          ref={ref}
          {...otherProps}
          sx={{ "& .MuiAutocomplete-listbox": { p: 0 } }}
        >
          {isNameInput && (
            <ToggleButtonGroup
              ref={toggleRef}
              exclusive
              size="small"
              value={store.nameView}
              onChange={(_event, view: NameView | null) => {
                if (view) store.nameView = view;
              }}
              // Keeps the focus, and so the popup, in the input
              onMouseDown={event => event.preventDefault()}
              aria-label={t.team.nameListView}
              // Keep the toggle anchored while the grid widens the dropdown
              sx={{
                display: "flex",
                justifyContent: "center",
                width: isGrid ? "100%" : nameListWidth,
                maxWidth: "100%",
                my: 0.5,
                "& > .MuiToggleButton-root": {
                  gap: 0.75,
                  px: isGrid ? 0.5 : 0.75,
                  minWidth: 0,
                  flex: isGrid ? 1 : undefined,
                  flexDirection: "row",
                  fontSize: 12,
                  lineHeight: 1,
                },
                "& svg": { flexShrink: 0 },
                "& > * > span[aria-hidden]": {
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <ToggleButton value="list" aria-label={t.team.listView}>
                <ViewListIcon fontSize="small" />
                <span aria-hidden="true" title={t.team.list}>
                  {t.team.list}
                </span>
              </ToggleButton>
              <ToggleButton value="grid" aria-label={t.team.gridView}>
                <GridViewIcon fontSize="small" />
                <span aria-hidden="true" title={t.team.grid}>
                  {t.team.grid}
                </span>
              </ToggleButton>
              {isGrid && (
                <ToggleButton value="big-grid" aria-label={t.team.bigGridView}>
                  <ViewModuleIcon fontSize="small" />
                  <span aria-hidden="true" title={t.team.bigGrid}>
                    {t.team.bigGrid}
                  </span>
                </ToggleButton>
              )}
            </ToggleButtonGroup>
          )}
          {isGrid ?
            <List
              className={className}
              listRef={internalListRef}
              key={`${store.nameView}-${itemCount}`}
              rowCount={rowCount}
              rowHeight={gridRowSize}
              rowComponent={GridRowComponent}
              rowProps={{ itemData, columns, large: isBigGrid }}
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
              rowProps={{ itemData, pokemonProperty, showMoveTypes }}
              // eslint-disable-next-line no-restricted-syntax -- react-window's own prop
              style={{ height: getHeight() + 2 * LISTBOX_PADDING }}
              overscanCount={5}
              tagName="ul"
            />
          }
        </Box>
      );
    },
  ),
);

export default VirtualizedListbox;
