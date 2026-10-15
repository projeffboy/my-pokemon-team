import { useId, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { MOVE_KEYS } from "@/types";
import type { DroppedEntry } from "@/store/dropped-entries";
import type { Translation } from "@/i18n/translation";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import { useTranslation } from "@/app/shared/TranslationContext";

// E.g. "Ho-Oh, move 4: Iron Hed", or "Pokemon 3: Missingno" for a pokemon
function describe(
  { teamIndex, pokemon, field, value }: DroppedEntry,
  { t, names }: Translation,
) {
  const messages = t.droppedEntries;
  const name = names.pokemon(pokemon);
  switch (field) {
    case "pokemon":
      return messages.pokemon(teamIndex + 1, value);
    case "item":
      return messages.item(name, value);
    case "ability":
      return messages.ability(name, value);
    default:
      return messages.move(name, MOVE_KEYS.indexOf(field) + 1, value);
  }
}

// Above the team until dismissed: what the link or saved team it holds lost
const DroppedEntriesNotice = observer(function DroppedEntriesNotice() {
  const translation = useTranslation();
  const { t } = translation;
  const messages = t.droppedEntries;
  const titleId = useId();
  const notice = store.currentDroppedEntries;
  // Tied to the notice, so that a later notice does not open with its details
  const [detailsOf, setDetailsOf] = useState<typeof notice>();
  if (!notice) return null;
  const { source, entries, text } = notice;
  const fromLink = source === "link";
  const closeDetails = () => setDetailsOf(undefined);

  return (
    <Grid size={12}>
      <Alert
        severity="warning"
        sx={{ "& .MuiAlert-message": { flexGrow: 1, minWidth: 0 } }}
      >
        <AlertTitle>
          {fromLink ?
            messages.linkTitle(entries.length)
          : messages.savedTeamTitle(entries.length)}
        </AlertTitle>
        {fromLink ?
          messages.linkReason(entries.length)
        : messages.savedTeamReason(entries.length)}
        <Box component="ul" sx={{ my: 1, pl: 2.5, overflowWrap: "anywhere" }}>
          {entries.map(entry => (
            <li key={`${entry.teamIndex}-${entry.field}`}>
              {describe(entry, translation)}
            </li>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            color="inherit"
            size="small"
            onClick={() => setDetailsOf(notice)}
          >
            {messages.details}
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={() => store.dismissDroppedEntries()}
          >
            {messages.dismiss}
          </Button>
        </Box>
      </Alert>
      <Dialog
        open={detailsOf === notice}
        onClose={closeDetails}
        aria-labelledby={titleId}
        fullWidth
      >
        <DialogTitle id={titleId}>{messages.detailsTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {fromLink ?
              messages.linkDetailsDescription
            : messages.savedTeamDetailsDescription}
          </DialogContentText>
          <TextField
            variant="standard"
            multiline
            fullWidth
            sx={{ mt: 2 }}
            value={text}
            slotProps={{
              htmlInput: { readOnly: true, "aria-labelledby": titleId },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              copyToClipboard(text, t.team.teamCopied, t.team.teamNotCopied)
            }
          >
            {messages.copy}
          </Button>
          <Button onClick={closeDetails}>{t.close}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
});

export default DroppedEntriesNotice;
