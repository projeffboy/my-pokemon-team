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
import { moveType } from "@/store/shared/effectiveness";
import PokemonIcon from "@/app/shared/PokemonIcon";
import PokemonDexSprite from "./virtualized-listbox/PokemonDexSprite";
import ListTools from "./shared/ListTools";
import { useTranslation } from "@/app/shared/TranslationContext";
import typeIcons from "@/images/type-icons";

const LISTBOX_PADDING = 0; // px
const ITEM_SIZE = 48;
export const gridColumns = (view: NameView) => (view === "big-grid" ? 3 : 5);
const GRID_ROW_SIZE = 40;
// A 72px sprite above three lines of its name
const BIG_GRID_ROW_SIZE = 122;
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
  teamIndex,
}: {
  move: string;
  teamIndex: number;
}) {
  const { names } = useTranslation();
  const member = store.analysisTeam[teamIndex];
  const type = moveType(
    move,
    member?.name ?? "",
    member?.ability,
    store.currentTeam.generation,
    member?.item,
    store.currentTeam.format,
  );
  // A placeholder keeps the labels aligned for the few moves without a type
  if (!type || !isPokemonType(type)) {
    return <Box component="span" sx={{ width: 20, flexShrink: 0 }} />;
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
  teamIndex,
  showMoveTypes,
  style,
}: RowComponentProps & {
  itemData: ItemData;
  pokemonProperty: string;
  teamIndex: number;
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
      {showMoveTypes && (
        <MoveTypeIcon move={option.value} teamIndex={teamIndex} />
      )}
      <Box component="span" sx={{ flex: 1, pl: showMoveTypes ? 0.75 : 0.25 }}>
        {option.label}
      </Box>
    </Typography>
  );
}

// A row of the grid view. The small grid is icons only, named for screen readers and
// the tooltip; the big grid has room for each name under its sprite.
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: large ? BIG_GRID_ROW_SIZE : GRID_ROW_SIZE,
              borderRadius: 1,
              // Overrides the option class's list-row spacing
              "&&": { minHeight: 0, p: 0 },
            }}
          >
            {large ?
              <>
                <PokemonDexSprite pokemon={option.value} />
                <Box
                  component="span"
                  sx={{
                    // Three lines at most, which fits the longest forme names on a small phone
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                    width: "100%",
                    px: 0.25,
                    boxSizing: "border-box",
                    fontSize: 12,
                    lineHeight: "14px",
                    textAlign: "center",
                    overflowWrap: "anywhere",
                  }}
                >
                  {option.label}
                </Box>
              </>
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
  teamIndex: number;
  // Whether the move options show their type, as the inputs do with Show move types on
  showMoveTypes: boolean;
  selectedValue: string;
  internalListRef: React.RefObject<ListImperativeAPI | null>;
  // Kept at the listed options' values, in order, and emptied when none are listed
  listedValuesRef: React.RefObject<readonly string[]>;
  onRowsRendered: () => void;
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
        teamIndex,
        showMoveTypes,
        selectedValue,
        internalListRef,
        listedValuesRef,
        onRowsRendered,
        popupMaxHeight,
        nameListWidth,
      } = context;
      const isNameInput = pokemonProperty === "name";
      const isGrid = isNameInput && store.nameView !== "list";
      const isBigGrid = isNameInput && store.nameView === "big-grid";
      // In Advanced mode, Filters and Sort sit beside the view toggle, which
      // drops its captions to make room; the tooltips and labels still name the views
      const showTools = isNameInput && store.isMoreOpen;
      // The move lists have Sort alone
      const showMoveTools =
        pokemonProperty.startsWith("move") && store.isMoreOpen;
      const columns = gridColumns(store.nameView);
      const gridRowSize = isBigGrid ? BIG_GRID_ROW_SIZE : GRID_ROW_SIZE;
      const itemData = children as ItemData;
      const itemCount = itemData.length;
      const rowCount = isGrid ? Math.ceil(itemCount / columns) : itemCount;
      React.useLayoutEffect(() => {
        listedValuesRef.current = itemData.map(([, option]) => option.value);
        return () => {
          listedValuesRef.current = [];
        };
      }, [itemData, listedValuesRef]);
      // Rows with wrapped (two-line) labels measure taller than single-line rows;
      // resetting the cache (via `key`) whenever the option list changes
      const dynamicRowHeight = useDynamicRowHeight({
        defaultRowHeight: ITEM_SIZE,
        key: itemCount,
      });

      const selectedIndex = itemData.findIndex(
        ([, option]) => option.value === selectedValue,
      );
      // Jump to the selected row when the popup opens or its options/view change.
      // Cancel before a filtered list mounts so a deferred scroll never uses an
      // index from the previous list.
      React.useLayoutEffect(() => {
        if (selectedIndex === -1) return;
        // react-window's imperative API object exists synchronously, but its
        // internal DOM element ref isn't attached until just after mount, so
        // scrollToRow silently no-ops if called immediately. Defer to the next
        // animation frame to ensure the underlying element is ready.
        const frame = requestAnimationFrame(() => {
          internalListRef.current?.scrollToRow({
            index: isGrid ? Math.floor(selectedIndex / columns) : selectedIndex,
            align: "auto",
          });
        });
        return () => cancelAnimationFrame(frame);
      }, [selectedIndex, itemCount, isGrid, columns, internalListRef]);

      // The view toggle takes some of the popup's room
      const toggleRef = React.useRef<HTMLDivElement>(null);
      const [toggleHeight, setToggleHeight] = React.useState(0);
      React.useLayoutEffect(() => {
        setToggleHeight(toggleRef.current?.offsetHeight ?? 0);
      }, [isNameInput, isGrid, showTools, showMoveTools]);

      // Uses the measured average row height (rows are shorter than ITEM_SIZE on
      // wider screens, where MUI's option minHeight is no longer forced to 48px)
      // so the popup doesn't reserve extra empty space below the rows. Up to
      // eight rows, or fewer where the screen has no room for them.
      const getHeight = () => {
        const rowHeight =
          isGrid ? gridRowSize : dynamicRowHeight.getAverageRowHeight();
        const rows = Math.min(isGrid ? rowCount : itemCount, 8) * rowHeight;
        if (popupMaxHeight === undefined) return rows;
        const chrome =
          isNameInput || showMoveTools ? toggleHeight + TOGGLE_MARGIN : 0;
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
            <Box
              ref={toggleRef}
              // Keeps the focus, and so the popup, in the input
              onMouseDown={event => event.preventDefault()}
              // Keep the toggle anchored while the grid widens the dropdown
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: showTools ? "space-between" : "center",
                boxSizing: "border-box",
                width: isGrid ? "100%" : nameListWidth,
                maxWidth: "100%",
                my: 0.5,
                px: showTools ? 0.5 : 0,
              }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={store.nameView}
                onChange={(_event, view: NameView | null) => {
                  if (view) store.nameView = view;
                }}
                aria-label={t.team.nameListView}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minWidth: 0,
                  width: showTools ? undefined : "100%",
                  "& > .MuiToggleButton-root": {
                    gap: 0.75,
                    px:
                      showTools ? undefined
                      : isGrid ? 0.5
                      : 0.75,
                    minWidth: 0,
                    flex: isGrid && !showTools ? 1 : undefined,
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
                {(
                  [
                    ["list", t.team.listView, t.team.list, ViewListIcon],
                    ["grid", t.team.gridView, t.team.grid, GridViewIcon],
                    ...(isGrid ?
                      ([
                        [
                          "big-grid",
                          t.team.bigGridView,
                          t.team.bigGrid,
                          ViewModuleIcon,
                        ],
                      ] as const)
                    : []),
                  ] as const
                ).map(([view, label, caption, Icon]) => (
                  <ToggleButton
                    key={view}
                    value={view}
                    aria-label={label}
                    title={showTools ? caption : undefined}
                  >
                    <Icon fontSize="small" />
                    {!showTools && (
                      <span aria-hidden="true" title={caption}>
                        {caption}
                      </span>
                    )}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {showTools && <ListTools />}
            </Box>
          )}
          {showMoveTools && (
            <Box
              ref={toggleRef}
              // Keeps the focus, and so the popup, in the input
              onMouseDown={event => event.preventDefault()}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                my: 0.5,
                px: 0.5,
              }}
            >
              <ListTools moves />
            </Box>
          )}
          {isGrid ?
            <List
              className={className}
              listRef={internalListRef}
              key={`${store.nameView}-${itemCount}`}
              rowCount={rowCount}
              onRowsRendered={onRowsRendered}
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
              onRowsRendered={onRowsRendered}
              rowHeight={dynamicRowHeight}
              rowComponent={RowComponent}
              rowProps={{ itemData, pokemonProperty, teamIndex, showMoveTypes }}
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
