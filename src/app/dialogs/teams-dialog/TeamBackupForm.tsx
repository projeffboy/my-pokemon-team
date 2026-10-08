import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import store from "@/store";
import { MAX_TEAM_BACKUP_BYTES, parseTeamBackup } from "@/store/team-backup";
import { useTranslation } from "@/app/shared/TranslationContext";
import downloadText from "./shared/download-text";

export default function TeamBackupForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const messages = t.teamBackup;
  const [file, setFile] = useState<{
    name: string;
    text: string;
    count: number;
  }>();
  const [isReading, setIsReading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const readVersion = useRef(0);
  useEffect(
    () => () => {
      readVersion.current += 1;
    },
    [],
  );

  const readFile = async (input: HTMLInputElement) => {
    const selected = input.files?.[0];
    input.value = "";
    if (!selected) return;
    const version = ++readVersion.current;
    setFile(undefined);
    setHasError(false);
    setIsReading(true);
    try {
      const text =
        selected.size <= MAX_TEAM_BACKUP_BYTES ? await selected.text() : "";
      if (version !== readVersion.current) return;
      const backup = parseTeamBackup(text);
      if (backup) {
        setFile({
          name: selected.name,
          text,
          count: backup.teams.length + (backup.draftTeam ? 1 : 0),
        });
      } else setHasError(true);
    } catch {
      if (version === readVersion.current) setHasError(true);
    } finally {
      if (version === readVersion.current) setIsReading(false);
    }
  };

  const save = () => {
    try {
      downloadText(
        messages.filename,
        store.exportTeamBackup(),
        "application/json",
      );
      store.openSnackbar(messages.saved, false, "export");
    } catch {
      store.openSnackbar(messages.saveFailed, false, "warning");
    }
  };

  const restore = () => {
    if (!file) return;
    const result = store.restoreTeamBackup(file.text);
    if (!result) {
      setHasError(true);
      return;
    }
    store.openSnackbar(
      result.added === 0 ? messages.alreadySaved
      : result.added === 1 ? t.importDialog.imported
      : t.importDialog.importedMany(result.added),
      false,
      "import",
    );
    onClose();
  };

  return (
    <>
      <DialogContent sx={{ pt: 2, px: { xxs: 2, sm: 3 } }}>
        <DialogContentText sx={{ mb: 2 }}>
          {messages.description}
        </DialogContentText>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={save}
        >
          {messages.save}
        </Button>
        <Divider sx={{ my: 3 }} />
        <DialogContentText sx={{ mb: 2 }}>
          {messages.restoreDescription}
        </DialogContentText>
        <Button
          fullWidth
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
        >
          {messages.chooseFile}
          <input
            hidden
            type="file"
            accept=".json,application/json"
            onChange={event => readFile(event.target)}
          />
        </Button>
        {file && (
          <>
            <Typography sx={{ mt: 2, overflowWrap: "anywhere" }}>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {messages.ready(file.count)}
            </Typography>
          </>
        )}
        {hasError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {messages.error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button disabled={!file || isReading || hasError} onClick={restore}>
          {messages.restore}
        </Button>
      </DialogActions>
    </>
  );
}
