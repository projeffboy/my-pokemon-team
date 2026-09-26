import { observer } from "mobx-react-lite";
import store from "@/store";
import TeamsDialog from "./dialogs/TeamsDialog";
import TeamSettingsDialog from "./dialogs/shared/TeamSettingsDialog";
import ImportTeamDialog from "./dialogs/ImportTeamDialog";
import AdvancedDialog from "./dialogs/AdvancedDialog";
import PokemonInfoDialog from "./dialogs/PokemonInfoDialog";
import FiltersDialog from "./dialogs/FiltersDialog";
import SortDialog from "./dialogs/SortDialog";

// The Name and Format dialog as the Manage Team menu opens it
const StoreTeamSettingsDialog = observer(function StoreTeamSettingsDialog() {
  const { dialog } = store;
  return (
    <TeamSettingsDialog
      teamId={dialog?.name === "teamSettings" ? dialog.teamId : null}
      onClose={() => store.closeDialog()}
    />
  );
});

// The dialogs that any part of the page can open through `store.openDialog`
export default function Dialogs() {
  return (
    <>
      <TeamsDialog />
      <StoreTeamSettingsDialog />
      <ImportTeamDialog />
      <AdvancedDialog />
      <PokemonInfoDialog />
      <FiltersDialog />
      <SortDialog />
    </>
  );
}
