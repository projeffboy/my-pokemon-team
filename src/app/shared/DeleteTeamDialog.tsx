import { useEffect, useId } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "./TranslationContext";

// Asks before a team is deleted, since deleting cannot be undone
const DeleteTeamDialog = observer(function DeleteTeamDialog({
  teamId,
  onClose,
}: {
  teamId: string | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const team = teamId ? store.findTeam(teamId) : undefined;
  const name = team?.name || t.deleteDialog.thisTeam;

  useEffect(() => {
    if (teamId && !team) onClose();
  }, [teamId, team, onClose]);

  const handleDelete = () => {
    if (!teamId || !store.findTeam(teamId)) {
      onClose();
      return;
    }
    store.deleteTeam(teamId);
    store.openSnackbar(t.team.teamDeleted, false, "delete");
    onClose();
  };

  return (
    <Dialog open={!!team} onClose={onClose} aria-labelledby={titleId}>
      <DialogTitle id={titleId}>{t.deleteDialog.title(name)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t.deleteDialog.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button color="error" onClick={handleDelete}>
          {t.team.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteTeamDialog;
