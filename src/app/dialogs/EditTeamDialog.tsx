import { useId, useLayoutEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import ImportTeamForm from "./shared/ImportTeamForm";

// Edits the current team as Showdown text
const EditTeamDialog = observer(function EditTeamDialog() {
  const { t } = useTranslation();
  const titleId = useId();
  const { dialog, currentTeamId } = store;
  const requested = dialog?.name === "editTeam";
  const isOpen = requested && dialog.teamId === currentTeamId;
  useLayoutEffect(() => {
    if (requested && !isOpen) store.closeDialog();
  }, [requested, isOpen]);
  const close = () => store.closeDialog();

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      sx={{ height: "calc(100% - 60px)" }}
      fullWidth
    >
      {isOpen && (
        <>
          <DialogTitle id={titleId}>{t.importDialog.editTitle}</DialogTitle>
          <ImportTeamForm isImport={false} onClose={close} />
        </>
      )}
    </Dialog>
  );
});

export default EditTeamDialog;
