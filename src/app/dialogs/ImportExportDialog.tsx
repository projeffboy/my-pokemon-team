import { useId, useLayoutEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import { heightAboveAd } from "@/app/shared/visual-viewport";
import ImportExportForm from "./shared/ImportExportForm";

// Copies, edits, and uploads the current team as Showdown text
const ImportExportDialog = observer(function ImportExportDialog() {
  const { t } = useTranslation();
  const titleId = useId();
  const { dialog, currentTeamId } = store;
  const requested = dialog?.name === "importExport";
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
      sx={{ height: heightAboveAd }}
      fullWidth
    >
      {isOpen && (
        <>
          <DialogTitle id={titleId}>{t.importDialog.title}</DialogTitle>
          <ImportExportForm scope="team" onClose={close} />
        </>
      )}
    </Dialog>
  );
});

export default ImportExportDialog;
