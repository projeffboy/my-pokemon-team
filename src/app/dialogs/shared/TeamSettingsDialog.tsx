import { useId, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { SavedTeam } from "@/types";
import { useTranslation } from "@/app/shared/TranslationContext";

function TeamNameForm({
  team,
  titleId,
  onClose,
}: {
  team: SavedTeam;
  titleId: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(team.name);
  const handleSave = () => {
    store.renameTeam(team.id, name.trim());
    onClose();
  };
  return (
    <>
      <DialogTitle id={titleId}>{t.settings.editTeamName}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label={t.settings.teamName}
          value={name}
          onChange={event => setName(event.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button onClick={handleSave}>{t.save}</Button>
      </DialogActions>
    </>
  );
}

const TeamSettingsDialog = observer(function TeamSettingsDialog({
  teamId,
  onClose,
}: {
  teamId: string | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const team = teamId ? store.findTeam(teamId) : undefined;
  return (
    <Dialog
      open={!!team}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      {team && (
        <TeamNameForm
          key={team.id}
          team={team}
          titleId={titleId}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
});

export default TeamSettingsDialog;
