import { useCallback, useEffect, useId, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CasinoIcon from "@mui/icons-material/Casino";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { englishNames } from "@/i18n/names";
import type { SavedTeam } from "@/types";
import { isTeamEmpty } from "@/shared/team";
import { serializeTeam, serializeTeams } from "@/store/team-text";
import { teamUrl } from "@/app/shared/team-link";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import DialogHeader from "@/app/shared/DialogHeader";
import { useIsSmDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import ImportTeamForm from "./shared/ImportTeamForm";
import TeamSettingsDialog from "./shared/TeamSettingsDialog";
import downloadText from "./teams-dialog/shared/download-text";
import TeamBackupForm from "./teams-dialog/TeamBackupForm";
import SavedTeamListItem from "./teams-dialog/SavedTeamListItem";
import useDiceRoll from "@/app/shared/use-dice-roll";

const halfWidth = { flex: "1 1 0", minWidth: 0 } as const;
const searchText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\p{M}\p{P}]/gu, "")
    .toLowerCase();

// Every saved team: open one, or manage it through its menu. Import Team is a
// second page of the dialog, which the Manage Team menu opens straight to.
const TeamsDialog = observer(function TeamsDialog() {
  const { t, names } = useTranslation();
  const titleId = useId();
  const searchStatusId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const query = searchText(search).trim();
  const terms = query.split(/\s+/).filter(Boolean);
  const visibleTeams =
    terms.length ?
      store.teams.filter(team => {
        const text = searchText(
          [
            team.name || t.team.unnamedTeam,
            ...team.team.flatMap(member => [
              member.name,
              englishNames.pokemon(member.name),
              names.pokemon(member.name),
              member.nickname ?? "",
            ]),
          ].join(" "),
        );
        return terms.every(term => text.includes(term));
      })
    : store.teams;
  const isSmDown = useIsSmDown();
  const diceRoll = useDiceRoll();
  const [menu, setMenu] = useState<{
    teamId: string;
    anchorEl: HTMLElement;
  } | null>(null);
  const [settingsTeamId, setSettingsTeamId] = useState<string | null>(null);
  const pendingSettingsTeamId = useRef<string | null>(null);
  const actionTrigger = useRef<HTMLElement | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const dialogName = store.dialog?.name;
  const isOpen = dialogName === "teams" || dialogName === "importTeam";
  const [page, setPage] = useState<"teams" | "import" | "backup">("teams");
  const isImporting = page === "import";
  const isSubpage = page !== "teams";
  const listRef = useRef<HTMLUListElement>(null);
  const currentTeamRef = useRef<HTMLLIElement>(null);
  const currentTeamId = store.currentTeamId;
  const scrollToCurrentTeam = useCallback(() => {
    const list = listRef.current;
    const current = currentTeamRef.current;
    if (!list || !current) return;
    list.scrollTop +=
      current.getBoundingClientRect().top -
      list.getBoundingClientRect().top -
      (list.clientHeight - current.offsetHeight) / 2;
  }, []);
  useEffect(() => {
    if (!isOpen || isSubpage) return;
    if (query) {
      if (listRef.current) listRef.current.scrollTop = 0;
    } else scrollToCurrentTeam();
  }, [isOpen, isSubpage, currentTeamId, query, scrollToCurrentTeam]);
  // The Manage Team menu opens straight to the import page
  useEffect(() => {
    if (dialogName === "importTeam") setPage("import");
    else if (!isOpen) {
      setPage("teams");
      setSearch("");
    }
  }, [dialogName, isOpen]);
  const close = useCallback(() => {
    store.closeDialog();
    setPage("teams");
    setSearch("");
  }, []);
  const menuTeam =
    menu ? visibleTeams.find(team => team.id === menu.teamId) : undefined;

  const load = useCallback(
    (teamId: string) => {
      store.selectTeam(teamId);
      close();
    },
    [close],
  );
  const openOptions = useCallback((teamId: string, anchorEl: HTMLElement) => {
    actionTrigger.current = anchorEl;
    setMenu({ teamId, anchorEl });
  }, []);
  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };
  const restoreListFocus = useCallback(() => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (
        !actionTrigger.current?.isConnected ||
        !active ||
        active === document.body ||
        active.getAttribute("role") === "dialog" ||
        !active.isConnected
      )
        searchInputRef.current?.focus();
    });
  }, []);
  useEffect(() => {
    if (!menu || menuTeam) return;
    pendingSettingsTeamId.current = null;
    setMenu(null);
    restoreListFocus();
  }, [menu, menuTeam, restoreListFocus]);

  const menuItems = (team: SavedTeam) => [
    {
      label: t.settings.editTeamName,
      Icon: EditIcon,
      act: () => {
        pendingSettingsTeamId.current = team.id;
      },
    },
    {
      label: t.team.share,
      Icon: LinkIcon,
      act: () =>
        isTeamEmpty(team.team) ?
          store.openSnackbar(t.team.teamEmpty, false, "warning")
        : copyToClipboard(
            teamUrl(team.team, team),
            t.team.linkCopied,
            t.team.linkNotCopied,
            "link",
          ),
    },
    {
      label: t.team.copyText,
      Icon: ContentCopyIcon,
      act: () =>
        isTeamEmpty(team.team) ?
          store.openSnackbar(t.team.nothingToCopy, false, "warning")
        : copyToClipboard(
            serializeTeam(team.team, team.generation, team.format),
            t.team.teamCopied,
            t.team.teamNotCopied,
          ),
    },
    {
      label: t.team.duplicate,
      Icon: FileCopyIcon,
      act: () => {
        const copy = store.duplicateTeam(team.id);
        if (copy) setSearch("");
        store.openSnackbar(
          copy ? t.team.teamDuplicated : t.team.cannotDuplicateEmptyTeam,
          false,
          copy ? "duplicate" : "warning",
        );
      },
    },
    {
      label: t.team.editPokepaste,
      Icon: EditNoteIcon,
      act: () => {
        store.selectTeam(team.id);
        store.openDialog("editTeam");
      },
    },
    {
      label: t.team.delete,
      Icon: DeleteIcon,
      act: () => setDeletingTeamId(team.id),
    },
  ];

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby={titleId}
        fullScreen={isSmDown}
        fullWidth
        maxWidth="xs"
        slotProps={{ transition: { onEntered: scrollToCurrentTeam } }}
      >
        <DialogHeader
          id={titleId}
          title={
            isImporting ? t.importDialog.importTitle
            : page === "backup" ?
              t.teamBackup.title
            : t.team.teams
          }
          onClose={isSubpage ? () => setPage("teams") : close}
          closeLabel={isSubpage ? t.goBack : t.close}
          back={isSubpage}
        />
        {isImporting ?
          <ImportTeamForm
            isImport
            onClose={() => setPage("teams")}
            onDone={() => {
              setSearch("");
              setPage("teams");
            }}
            // The same gap below the title bar as the team list has
            contentSx={{ pt: 2, px: { xxs: 2, sm: 3 } }}
          />
        : page === "backup" ?
          <TeamBackupForm
            onClose={() => setPage("teams")}
            onDone={() => {
              setSearch("");
              setPage("teams");
            }}
          />
        : <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              px: { xxs: 2, sm: 3 },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, mb: 1, flexShrink: 0, "& > *": halfWidth }}
            >
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  const { isNew } = store.openEmptyTeam();
                  store.openSnackbar(
                    isNew ? t.teams.newTeamCreated : t.teams.emptyTeamOpened,
                    false,
                    "add",
                  );
                  close();
                }}
              >
                {t.teams.newTeam}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CasinoIcon />}
                disabled={!store.learnsetsLoaded}
                {...diceRoll}
                onClick={event => {
                  const teamId = store.currentTeamId;
                  diceRoll.onClick(event, () => {
                    if (store.currentTeamId !== teamId) return;
                    if (!store.filteredPokemon.length) {
                      store.openSnackbar(
                        t.team.noMatchingPokemon,
                        false,
                        "warning",
                      );
                      return;
                    }
                    const filters = { ...store.filters };
                    store.openEmptyTeam();
                    store.filters = filters;
                    store.randomizeTeam();
                    store.openSnackbar(
                      t.teams.randomTeamCreated,
                      false,
                      "random",
                    );
                    close();
                  });
                }}
              >
                {t.teams.randomTeam}
              </Button>
            </Stack>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<UploadIcon />}
              onClick={() => setPage("import")}
              sx={{ mb: 1, flexShrink: 0 }}
            >
              {t.teams.importTeam}
            </Button>
            <TextField
              inputRef={searchInputRef}
              label={t.teams.search}
              placeholder={t.teams.searchPlaceholder}
              type="search"
              size="small"
              fullWidth
              value={search}
              onChange={event => setSearch(event.target.value)}
              sx={{
                mt: 1,
                flexShrink: 0,
                "& input::-webkit-search-cancel-button": { display: "none" },
              }}
              slotProps={{
                htmlInput: { "aria-describedby": searchStatusId },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment:
                    search ?
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={t.teams.clearSearch}
                          edge="end"
                          size="small"
                          onClick={clearSearch}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    : undefined,
                },
              }}
            />
            <Typography
              id={searchStatusId}
              variant="caption"
              color="text.secondary"
              role="status"
              aria-atomic="true"
              sx={{ mt: 0.75, flexShrink: 0 }}
            >
              {query ?
                t.teams.searchCount(visibleTeams.length, store.teams.length)
              : t.teams.teamCount(store.teams.length)}
            </Typography>
            <List
              ref={listRef}
              aria-label={t.teams.savedTeams}
              sx={{
                minHeight: 160,
                flex: "1 1 auto",
                overflowY: "auto",
              }}
            >
              {visibleTeams.map(team => (
                <SavedTeamListItem
                  key={team.id}
                  team={team}
                  isCurrent={team.id === currentTeamId}
                  menuOpen={menu?.teamId === team.id}
                  currentTeamRef={
                    team.id === currentTeamId ? currentTeamRef : undefined
                  }
                  onOpen={load}
                  onOptions={openOptions}
                />
              ))}
              {!visibleTeams.length && (
                <Typography
                  component="li"
                  role="presentation"
                  color="text.secondary"
                  sx={{ py: 3, textAlign: "center", listStyle: "none" }}
                >
                  {t.teams.noSearchResults}
                </Typography>
              )}
            </List>
            <Box sx={{ flexShrink: 0 }}>
              {/* Every team as one Showdown text, which Import Team reads back */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, "& > *": halfWidth }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() =>
                    copyToClipboard(
                      serializeTeams(store.teams),
                      t.teams.copiedAll,
                      t.teams.notCopiedAll,
                    )
                  }
                >
                  {t.teams.copyAll}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    downloadText(
                      t.teams.exportFilename,
                      serializeTeams(store.teams),
                    );
                    store.openSnackbar(t.teams.exported, false, "export");
                  }}
                >
                  {t.teams.exportAll}
                </Button>
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SettingsBackupRestoreIcon />}
                onClick={() => setPage("backup")}
                sx={{ mt: 1 }}
              >
                {t.teamBackup.title}
              </Button>
              <Typography
                variant="caption"
                component="p"
                sx={{
                  mt: 2,
                  textAlign: "center",
                  color: store.saveFailed ? "error.main" : "text.secondary",
                }}
              >
                {store.saveFailed ? t.teams.saveFailed : t.teams.savedInBrowser}
              </Typography>
            </Box>
          </DialogContent>
        }
      </Dialog>
      <Menu
        anchorEl={menuTeam ? menu?.anchorEl : null}
        open={!!menu && !!menuTeam}
        onClose={() => setMenu(null)}
        slotProps={{
          transition: {
            onExited: () => {
              const teamId = pendingSettingsTeamId.current;
              pendingSettingsTeamId.current = null;
              // Let the menu restore focus before the editor takes it.
              if (isOpen && teamId) setSettingsTeamId(teamId);
            },
          },
        }}
      >
        {menuTeam &&
          menuItems(menuTeam).map(({ label, Icon, act }) => (
            <MenuItem
              key={label}
              onClick={() => {
                setMenu(null);
                act();
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
      <TeamSettingsDialog
        teamId={settingsTeamId}
        onClose={() => {
          setSettingsTeamId(null);
          restoreListFocus();
        }}
      />
      <DeleteTeamDialog
        teamId={deletingTeamId}
        onClose={() => {
          setDeletingTeamId(null);
          restoreListFocus();
        }}
      />
    </>
  );
});

export default TeamsDialog;
