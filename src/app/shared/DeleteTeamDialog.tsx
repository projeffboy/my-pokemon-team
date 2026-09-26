import { useId } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";

// Asks before a team is deleted, since deleting cannot be undone
const DeleteTeamDialog = observer(function DeleteTeamDialog({
  teamId,
  onClose,
}: {
  teamId: string | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const team = store.teams.find(team => team.id === teamId);
  const name = team?.name || "this team";

  const handleDelete = () => {
    if (teamId) store.deleteTeam(teamId);
    store.openSnackbar("Team deleted");
    onClose();
  };

  return (
    <Dialog open={!!teamId} onClose={onClose} aria-labelledby={titleId}>
      <DialogTitle id={titleId}>Delete {name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The team and its pokemon are removed from this browser. This cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteTeamDialog;
