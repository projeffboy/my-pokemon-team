import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { isTeamEmpty } from "@/shared/team";
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

const MAX_LINKS = 20;

const linkIds = (text: string) => [
  ...new Set(text.split("\n").flatMap(line => pokepasteId(line) ?? [])),
];
const hasLink = (text: string) => linkIds(text).length > 0;

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
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => () => fetching.current?.abort(), []);
  const { generation } = store.currentTeam;
  const { dataFormat, learnsetsLoaded } = store;
  const deferredText = useDeferredValue(text);
  const problems = useMemo(
    () =>
      isTeams || !learnsetsLoaded || hasLink(deferredText) ?
        []
      : teamTextProblems(deferredText, generation, dataFormat),
    [isTeams, learnsetsLoaded, deferredText, generation, dataFormat],
  );

  const fail = (problem: "nothingFound" | "linkFailed") => {
    setError(problem);
    input.current?.focus();
  };

  const addTeams = (source: string) => {
    const teams = parseTeamsText(
      headerAppendedText(initialText, source),
      store.currentTeam,
    );
    if (!teams.length) {
      fail("nothingFound");
      return;
    }
    const added = teamsToAdd(teams, store.teams);
    // Text added after the shown teams that no team came out of was not read
    if (
      !added.length &&
      source.startsWith(initialText) &&
      source.slice(initialText.length).trim() &&
      teams.length <= parseTeamsText(initialText, store.currentTeam).length
    ) {
      fail("nothingFound");
      return;
    }
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

  // A link whose paste holds no pokemon would empty the team without a word
  const updateTeam = (source: string, fromLink: boolean) => {
    if (source === initialText) store.openSnackbar(importDialog.noChanges);
    else {
      const team = parseTeamText(
        source,
        store.currentTeam.generation,
        store.dataFormat,
      );
      if (fromLink && isTeamEmpty(team)) {
        fail("nothingFound");
        return;
      }
      store.replaceTeam(team);
    }
    onDone();
  };

  // Each line that is only a pokepast.es link becomes its paste, or, among teams,
  // a team named and set to the game as the paste says
  const readLinks = async (source: string, signal: AbortSignal) => {
    if (linkIds(source).length > MAX_LINKS) throw new Error("Too many links");
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
    const fromLink = hasLink(text);
    if (fromLink) {
      const controller = new AbortController();
      fetching.current = controller;
      setIsFetching(true);
      try {
        source = await readLinks(text, controller.signal);
      } catch {
        if (!controller.signal.aborted) {
          setIsFetching(false);
          fail("linkFailed");
        }
        return;
      }
      if (controller.signal.aborted) return;
      setIsFetching(false);
    }
    if (isTeams) addTeams(source);
    else updateTeam(source, fromLink);
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
        <TextField
          autoFocus
          placeholder={importDialog.placeholder}
          multiline
          // Tall enough to read as a box when empty; a long team scrolls within the field,
          // keeping the problems below it in view
          minRows={isSmDown ? 4 : 8}
          maxRows={isSmDown ? 6 : 12}
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          value={text}
          onChange={event => {
            setText(event.target.value);
            setError(undefined);
          }}
          error={!!error}
          helperText={error && importDialog[error]}
          inputRef={input}
          slotProps={{
            // Spoken when it appears, since the focus is elsewhere while a link loads
            formHelperText: { role: "status" },
            htmlInput: {
              ...verbatim("team-text"),
              // The description above names the box, so the label is for screen readers
              "aria-label": importDialog.label,
              // Edits made while links load would be lost to the text they were read from
              readOnly: isFetching,
            },
            // Showdown's text lines up its moves and stats, as in its own import box
            input: { sx: { fontFamily: "monospace", fontSize: 14 } },
          }}
        />
        <TeamTextProblems problems={problems} />
        <Typography
          variant="caption"
          component="p"
          sx={{ color: "text.secondary", mt: 1 }}
        >
          {importDialog.kept}
        </Typography>
      </DialogContent>
      {/* The actions that leave the dialog stay apart from the ones on the text. Where a
          language's labels leave no room for all of them, they wrap in groups. */}
      <DialogActions
        disableSpacing
        sx={{ flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}
      >
        <Button
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
            startIcon={<UploadIcon />}
            disabled={isEmpty || hasLink(text)}
            onClick={() =>
              uploadToPokepaste(pokepasteUpload(store.currentTeam, text))
            }
          >
            {importDialog.uploadToPokepaste}
          </Button>
        }
        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
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
        </Box>
      </DialogActions>
    </>
  );
});

export default ImportExportForm;
