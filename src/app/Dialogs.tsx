import TeamsDialog from "./dialogs/TeamsDialog";
import EditTeamDialog from "./dialogs/EditTeamDialog";
import AdvancedDialog from "./dialogs/AdvancedDialog";
import PokemonInfoDialog from "./dialogs/PokemonInfoDialog";
import FiltersDialog from "./dialogs/FiltersDialog";
import SortDialog from "./dialogs/SortDialog";

// The dialogs that any part of the page can open through `store.openDialog`
export default function Dialogs() {
  return (
    <>
      <TeamsDialog />
      <EditTeamDialog />
      <AdvancedDialog />
      <PokemonInfoDialog />
      <FiltersDialog />
      <SortDialog />
    </>
  );
}
