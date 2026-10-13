import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

// Filters and Sort, in the dropdown whose list they change: both for the pokemon,
// and Sort alone for the moves
export default function ListTools({ moves = false }: { moves?: boolean }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", flexShrink: 0 }}>
      {!moves && (
        <IconButton
          size="small"
          aria-label={t.team.filters}
          title={t.team.filters}
          onClick={() => store.openDialog("filters")}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton
        size="small"
        aria-label={t.team.sort}
        title={t.team.sort}
        onClick={() =>
          store.openDialog("sort", { sortTab: moves ? "moves" : "pokemon" })
        }
      >
        <SortIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
