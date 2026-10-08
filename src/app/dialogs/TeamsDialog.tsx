import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CasinoIcon from "@mui/icons-material/Casino";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
import type { SavedTeam } from "@/types";
import { variantGeneration } from "@/shared/game-variants";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { GENERATION_GAMES } from "@/shared/generations";
import { isTeamEmpty } from "@/shared/team";
import { serializeTeam, serializeTeams } from "@/store/team-text";
import { teamUrl } from "@/app/shared/team-link";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import PokemonIcon from "@/app/shared/PokemonIcon";
import questionMark from "@/images/question-mark.png";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import DialogHeader from "@/app/shared/DialogHeader";
import { useIsSmDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import ImportTeamForm from "./shared/ImportTeamForm";
import TeamSettingsDialog from "./shared/TeamSettingsDialog";
import downloadText from "./teams-dialog/shared/download-text";
import TeamBackupForm from "./teams-dialog/TeamBackupForm";
import useDiceRoll from "@/app/shared/use-dice-roll";

const halfWidth = { flex: "1 1 0", minWidth: 0 } as const;
// One of a team's six icons. On a narrow phone the slots shrink and the icons,
// which have blank edges, overlap a little, so the six stay on one line.
const iconSlot = {
  flex: "0 1 40px",
  minWidth: 0,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { flexShrink: 0 },
} as const;

// Every saved team: open one, or manage it through its menu. Import Team is a
// second page of the dialog, which the Manage Team menu opens straight to.
const TeamsDialog = observer(function TeamsDialog() {
  const { t } = useTranslation();
  const titleId = useId();
  const teamSubtitle = ({ generation, format }: SavedTeam) =>
    format === CHAMPIONS_FORMAT ? t.championsGeneration
    : variantGeneration(format) ?
      t.gameVariants[format as keyof typeof t.gameVariants]
    : `${t.generation(generation)} (${GENERATION_GAMES[generation]})`;
  const isSmDown = useIsSmDown();
  const diceRoll = useDiceRoll();
  const [menu, setMenu] = useState<{
    teamId: string;
    anchorEl: HTMLElement;
  } | null>(null);
  const [settingsTeamId, setSettingsTeamId] = useState<string | null>(null);
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
    if (isOpen && !isSubpage) scrollToCurrentTeam();
  }, [isOpen, isSubpage, currentTeamId, scrollToCurrentTeam]);
  // The Manage Team menu opens straight to the import page
  useEffect(() => {
    if (dialogName === "importTeam") setPage("import");
    else if (!isOpen) setPage("teams");
  }, [dialogName, isOpen]);
  const close = () => {
    store.closeDialog();
    setPage("teams");
  };
  const menuTeam = store.teams.find(team => team.id === menu?.teamId);

  const load = (team: SavedTeam) => {
    store.selectTeam(team.id);
    close();
  };

  const menuItems = (team: SavedTeam) => [
    {
      label: t.settings.editTeamName,
      Icon: EditIcon,
      act: () => setSettingsTeamId(team.id),
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
            serializeTeam(team.team),
            t.team.teamCopied,
            t.team.teamNotCopied,
          ),
    },
    {
      label: t.team.duplicate,
      Icon: FileCopyIcon,
      act: () => {
        const copy = store.duplicateTeam(team.id);
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
            // The same gap below the title bar as the team list has
            contentSx={{ pt: 2, px: { xxs: 2, sm: 3 } }}
          />
        : page === "backup" ?
          <TeamBackupForm onClose={() => setPage("teams")} />
        : <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
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
                    store.openEmptyTeam();
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
            <List
              ref={listRef}
              aria-label={t.teams.savedTeams}
              sx={{ minHeight: 0, flex: "1 1 auto", overflowY: "auto" }}
            >
              {store.teams.map(team => {
                const isCurrent = team.id === store.currentTeamId;
                const name = team.name || t.team.unnamedTeam;
                return (
                  <ListItem
                    key={team.id}
                    ref={isCurrent ? currentTeamRef : undefined}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label={t.teams.optionsFor(name)}
                        aria-haspopup="menu"
                        onClick={(event: MouseEvent<HTMLElement>) =>
                          setMenu({
                            teamId: team.id,
                            anchorEl: event.currentTarget,
                          })
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={isCurrent}
                      aria-current={isCurrent}
                      aria-label={t.teams.load(name)}
                      onClick={() => load(team)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        border: 1,
                        borderColor: isCurrent ? "text.primary" : "divider",
                      }}
                    >
                      <ListItemText
                        primary={
                          <>
                            <Box
                              component="span"
                              sx={{
                                flex: "1 1 auto",
                                minWidth: 0,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {name}
                            </Box>
                            {/* The whole card is the button; the chip shows that a tap opens the team */}
                            <Chip
                              label={
                                isCurrent ?
                                  t.teams.current
                                : <>
                                    {t.teams.open}
                                    <ChevronRightIcon />
                                  </>
                              }
                              size="small"
                              color="primary"
                              variant={isCurrent ? "filled" : "outlined"}
                              sx={{
                                flexShrink: 0,
                                height: 20,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                cursor: "inherit",
                                "& .MuiChip-label": {
                                  display: "flex",
                                  alignItems: "center",
                                },
                                "& svg": { fontSize: 16, mr: -0.75 },
                              }}
                            />
                          </>
                        }
                        secondary={
                          <>
                            {teamSubtitle(team)}
                            <Box
                              component="span"
                              sx={{ display: "flex", mt: 0.5 }}
                            >
                              {team.team.map((member, i) => (
                                <Box key={i} component="span" sx={iconSlot}>
                                  {member.name ?
                                    <PokemonIcon
                                      pokemonProperty="name"
                                      value={member.name}
                                    />
                                  : <Box
                                      component="img"
                                      src={questionMark}
                                      alt=""
                                      sx={{ height: 24 }}
                                    />
                                  }
                                </Box>
                              ))}
                            </Box>
                          </>
                        }
                        slotProps={{
                          primary: {
                            sx: {
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              columnGap: 1,
                              rowGap: 0.5,
                            },
                          },
                          secondary: { component: "div" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
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
        anchorEl={menu?.anchorEl}
        open={!!menu}
        onClose={() => setMenu(null)}
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
        onClose={() => setSettingsTeamId(null)}
      />
      <DeleteTeamDialog
        teamId={deletingTeamId}
        onClose={() => setDeletingTeamId(null)}
      />
    </>
  );
});

export default TeamsDialog;
