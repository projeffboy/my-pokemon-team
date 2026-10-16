import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TableSortLabel from "@mui/material/TableSortLabel";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

// The moves sort by name or type, so both choices fit in the dropdown itself, as
// a table's column headers: pressing the active one reverses it
const MoveSort = observer(function MoveSort() {
  const { t } = useTranslation();
  const { by, descending } = store.moveSort;
  return (
    <Box
      role="group"
      aria-label={t.sort.sortBy}
      sx={{ display: "flex", gap: 0.5, typography: "body2" }}
    >
      {(["name", "type"] as const).map(key => {
        const active = by === key;
        const label = key === "type" ? t.filters.type : t.sort.name;
        const order = descending ? t.sort.descending : t.sort.ascending;
        return (
          <TableSortLabel
            key={key}
            // A real button, which Tab from the input reaches as it does the Name dropdown's tools
            component="button"
            active={active}
            direction={active && descending ? "desc" : "asc"}
            aria-pressed={active}
            aria-label={active ? `${label}, ${order}` : label}
            onClick={() => {
              if (active) store.moveSort.descending = !descending;
              else store.moveSort = { by: key, descending: false };
            }}
            sx={{
              minHeight: 34,
              px: 1,
              font: "inherit",
              borderRadius: 1,
              "&.Mui-focusVisible": { bgcolor: "action.focus" },
            }}
          >
            {label}
          </TableSortLabel>
        );
      })}
    </Box>
  );
});

// Filters and Sort, in the dropdown whose list they change: both for the pokemon,
// and the sort alone for the moves
export default function ListTools({ moves = false }: { moves?: boolean }) {
  const { t } = useTranslation();
  if (moves) return <MoveSort />;
  return (
    <Box sx={{ display: "flex", flexShrink: 0 }}>
      <IconButton
        size="small"
        aria-label={t.team.filters}
        title={t.team.filters}
        onClick={() => store.openDialog("filters")}
      >
        <FilterListIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={t.team.sort}
        title={t.team.sort}
        onClick={() => store.openDialog("sort")}
      >
        <SortIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
