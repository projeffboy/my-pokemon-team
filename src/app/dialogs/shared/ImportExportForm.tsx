import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { inputLabelClasses } from "@mui/material/InputLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  pokepasteId,
  pokepasteTeamText,
  pokepasteUpload,
} from "@/store/pokepaste";
import {
  headerAppendedText,
  parseTeamsText,
  parseTeamText,
  serializeTeam,
  serializeTeams,
  teamsToAdd,
  teamTextProblems,
} from "@/store/team-text";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import { verbatim } from "@/app/shared/text-entry";
import { useIsSmDown } from "@/app/shared/WidthContext";
import downloadText from "./import-export-form/download-text";
import {
  fetchPokepaste,
  uploadToPokepaste,
} from "./import-export-form/pokepaste";
import TeamTextProblems from "./import-export-form/TeamTextProblems";

const hasLink = (text: string) =>
  text.split("\n").some(line => pokepasteId(line));

// A dialog's body and actions for the Showdown text of the current team or of every
// team: copy it, change it or paste other text or pokepast.es links, and update the
// team or add the teams. The team can also be uploaded to PokePaste.
// Updating or adding calls onDone; cancelling calls onClose.
const ImportExportForm = observer(function ImportExportForm({
  scope,
  onClose,
  onDone = onClose,
  contentSx,
}: {
  scope: "team" | "teams";
  onClose: () => void;
  onDone?: () => void;
  contentSx?: SxProps<Theme>;
}) {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const { importDialog } = t;
  const isTeams = scope === "teams";
  const [initialText] = useState(() =>
    isTeams ?
      serializeTeams(store.teams)
    : serializeTeam(store.team, store.currentTeam.generation, store.dataFormat),
  );
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<"nothingFound" | "linkFailed">();
  const [isFetching, setIsFetching] = useState(false);
  const fetching = useRef<AbortController>(null);
  useEffect(() => () => fetching.current?.abort(), []);
  const { generation } = store.currentTeam;
  const { dataFormat, learnsetsLoaded } = store;
  const deferredText = useDeferredValue(text);
  const isLink = !!pokepasteId(text);
  const problems = useMemo(
    () =>
      isTeams || !learnsetsLoaded || hasLink(deferredText) ?
        []
      : teamTextProblems(deferredText, generation, dataFormat),
    [isTeams, learnsetsLoaded, deferredText, generation, dataFormat],
  );

  const addTeams = (source: string) => {
    const teams = parseTeamsText(
      headerAppendedText(initialText, source),
      store.currentTeam,
    );
    if (!teams.length) {
      setError("nothingFound");
      return;
    }
    const added = teamsToAdd(teams, store.teams);
    for (const { name, ...settings } of added)
      store.addTeam({ ...settings, ...(name && { name }) });
    store.openSnackbar(
      added.length === 0 ? importDialog.noNewTeams
      : added.length === 1 ? importDialog.imported
      : importDialog.importedMany(added.length),
      false,
      "import",
    );
    onDone();
  };

  const updateTeam = (source: string) => {
    if (source !== initialText)
      store.replaceTeam(
        parseTeamText(source, store.currentTeam.generation, store.dataFormat),
      );
    else store.openSnackbar(importDialog.noChanges);
    onDone();
  };

  // Each line that is only a pokepast.es link becomes its paste, or, among teams,
  // a team named and set to the game as the paste says
  const readLinks = async (source: string, signal: AbortSignal) => {
    const lines = source.split("\n");
    const pastes = new Map<string, ReturnType<typeof fetchPokepaste>>();
    for (const line of lines) {
      const id = pokepasteId(line);
      if (id && !pastes.has(id)) pastes.set(id, fetchPokepaste(id, signal));
    }
    return (
      await Promise.all(
        lines.map(async line => {
          const id = pokepasteId(line);
          const paste = id && (await pastes.get(id));
          return (
            paste ?
              isTeams ? pokepasteTeamText(paste)
              : paste.paste
            : line
          );
        }),
      )
    ).join("\n");
  };

  const submit = async () => {
    setError(undefined);
    let source = text;
    if (hasLink(text)) {
      const controller = new AbortController();
      fetching.current = controller;
      setIsFetching(true);
      try {
        source = await readLinks(text, controller.signal);
      } catch {
        if (!controller.signal.aborted) {
          setIsFetching(false);
          setError("linkFailed");
        }
        return;
      }
      if (controller.signal.aborted) return;
      setIsFetching(false);
    }
    if (isTeams) addTeams(source);
    else updateTeam(source);
  };

  const isEmpty = !text.trim();

  return (
    <>
      <DialogContent sx={contentSx}>
        <DialogContentText>
          {fill(
            isTeams ? importDialog.teamsDescription : importDialog.description,
            {
              showdown: (
                <Link href="https://play.pokemonshowdown.com/teambuilder">
                  {importDialog.showdown}
                </Link>
              ),
            },
          )}
        </DialogContentText>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            disabled={isEmpty}
            onClick={() =>
              isTeams ?
                copyToClipboard(text, t.teams.copiedAll, t.teams.notCopiedAll)
              : copyToClipboard(text, t.team.teamCopied, t.team.teamNotCopied)
            }
          >
            {importDialog.copy}
          </Button>
          {isTeams ?
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              disabled={isEmpty}
              onClick={() => {
                downloadText(t.teams.exportFilename, text);
                store.openSnackbar(t.teams.exported, false, "export");
              }}
            >
              {importDialog.download}
            </Button>
          : <Button
              variant="outlined"
              size="small"
              startIcon={<UploadIcon />}
              disabled={isEmpty || isLink}
              onClick={() =>
                uploadToPokepaste(pokepasteUpload(store.currentTeam, text))
              }
            >
              {importDialog.uploadToPokepaste}
            </Button>
          }
        </Box>
        <TextField
          autoFocus
          variant="standard"
          placeholder={importDialog.placeholder}
          label={importDialog.label}
          multiline
          // A long team scrolls within the field, keeping the problems below it in view
          maxRows={isSmDown ? 6 : 10}
          fullWidth
          sx={{ my: 2.5 }}
          value={text}
          onChange={event => {
            setText(event.target.value);
            setError(undefined);
          }}
          error={!!error}
          helperText={error && importDialog[error]}
          slotProps={{
            htmlInput: verbatim("team-text"),
            // Above the text rather than over it, so a long label wraps instead of being
            // cut off at 320px
            inputLabel: {
              shrink: true,
              sx: {
                position: "static",
                transform: "none",
                maxWidth: "100%",
                whiteSpace: "normal",
                // The size the shrunk label had when it floated
                fontSize: "0.75rem",
              },
            },
            input: { sx: { [`.${inputLabelClasses.root} + &`]: { mt: 0 } } },
          }}
        />
        <TeamTextProblems problems={problems} />
        <DialogContentText>{importDialog.kept}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button
          onClick={submit}
          loading={isFetching}
          // Until the problems describe the current text, an update could skip them
          disabled={
            !learnsetsLoaded || (isTeams ? isEmpty : deferredText !== text)
          }
        >
          {isTeams ? importDialog.addTeams : importDialog.update}
        </Button>
      </DialogActions>
    </>
  );
});

export default ImportExportForm;
