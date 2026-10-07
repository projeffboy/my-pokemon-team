import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import ToolbarButton from "./team-toolbar/shared/ToolbarButton";

const TeamSearchTools = observer(function TeamSearchTools({
  stacked = false,
}: {
  stacked?: boolean;
}) {
  const { t } = useTranslation();
  if (!store.isMoreOpen) return null;
  return [
    { name: "filters" as const, label: t.team.filters, Icon: FilterListIcon },
    { name: "sort" as const, label: t.team.sort, Icon: SortIcon },
  ].map(({ name, label, Icon }) =>
    stacked ?
      <ToolbarButton
        key={name}
        icon={<Icon />}
        onClick={() => store.openDialog(name)}
      >
        {label}
      </ToolbarButton>
    : <Button
        key={name}
        startIcon={<Icon />}
        onClick={() => store.openDialog(name)}
      >
        {label}
      </Button>,
  );
});

export default TeamSearchTools;
