import { useId, useState, type MouseEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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
import CasinoIcon from "@mui/icons-material/Casino";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { SavedTeam } from "@/types";
import { formatShortName } from "@/shared/formats";
import { generationLabel } from "@/shared/generations";
import { isTeamEmpty } from "@/shared/team";
import { serializeTeam, serializeTeams } from "@/app/shared/team-text";
import { teamUrl } from "@/app/shared/team-link";
import copyToClipboard from "@/app/main/shared/copy-to-clipboard";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import { useBreakpoint } from "@/app/shared/WidthContext";
import TeamSettingsDialog from "./shared/TeamSettingsDialog";
import downloadText from "./teams-dialog/download-text";

const teamSubtitle = ({ generation, format }: SavedTeam) =>
  `${generationLabel(generation)}${format ? ` · ${formatShortName(format)}` : ""}`;

// Every saved team: open one, or manage it through its menu
const TeamsDialog = observer(function TeamsDialog() {
  const titleId = useId();
  const isXs = useBreakpoint() === "xs";
  const [menu, setMenu] = useState<{
    teamId: string;
    anchorEl: HTMLElement;
  } | null>(null);
  const [settingsTeamId, setSettingsTeamId] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const isOpen = store.dialog?.name === "teams";
  const close = () => store.closeDialog();
  const menuTeam = store.teams.find(team => team.id === menu?.teamId);

  const load = (team: SavedTeam) => {
    store.selectTeam(team.id);
    close();
  };

  const menuItems = (team: SavedTeam) => [
    {
      label: "Name and Format",
      Icon: SettingsIcon,
      act: () => setSettingsTeamId(team.id),
    },
    {
      label: "Share",
      Icon: LinkIcon,
      act: () =>
        isTeamEmpty(team.team) ?
          store.openSnackbar("Pokemon team is empty")
        : copyToClipboard(
            teamUrl(team.team),
            "Pokemon team link copied",
            "Could not copy the link.",
          ),
    },
    {
      label: "Copy text",
      Icon: ContentCopyIcon,
      act: () =>
        isTeamEmpty(team.team) ?
          store.openSnackbar("Empty team, nothing to copy.")
        : copyToClipboard(
            serializeTeam(team.team),
            "Team copied.",
            "Could not copy the team.",
          ),
    },
    {
      label: "Duplicate",
      Icon: FileCopyIcon,
      act: () => {
        store.duplicateTeam(team.id);
        store.openSnackbar("Team duplicated");
      },
    },
    {
      label: "Edit Pokepaste",
      Icon: EditNoteIcon,
      act: () => {
        store.selectTeam(team.id);
        store.openDialog("editTeam");
      },
    },
    {
      label: "Delete",
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
        fullScreen={isXs}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id={titleId}>Teams</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Tap a team to open it. The ⋮ button has its settings and actions.
          </DialogContentText>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                store.addTeam();
                close();
              }}
            >
              New Team
            </Button>
            <Button
              variant="outlined"
              startIcon={<CasinoIcon />}
              disabled={!store.learnsetsLoaded}
              onClick={() => {
                store.addTeam();
                store.randomizeTeam();
                close();
              }}
            >
              Random Team
            </Button>
          </Stack>
          <List aria-label="Saved teams">
            {store.teams.map(team => {
              const isCurrent = team.id === store.currentTeamId;
              const name = team.name || "Team";
              return (
                <ListItem
                  key={team.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={`Options for ${name}`}
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
                    aria-label={`Load ${name}`}
                    onClick={() => load(team)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemText
                      primary={name}
                      secondary={
                        <>
                          {teamSubtitle(team)}
                          <Box
                            component="span"
                            sx={{ display: "flex", flexWrap: "wrap", mt: 0.5 }}
                          >
                            {team.team.map((member, i) =>
                              member.name ?
                                <PokemonIcon
                                  key={i}
                                  pokemonProperty="name"
                                  value={member.name}
                                />
                              : <Box
                                  key={i}
                                  component="span"
                                  sx={{
                                    width: 40,
                                    height: 30,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled",
                                  }}
                                >
                                  ?
                                </Box>,
                            )}
                          </Box>
                        </>
                      }
                      slotProps={{ secondary: { component: "div" } }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => store.openDialog("importTeam")}
            >
              Import Team
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() =>
                downloadText(
                  "my-pokemon-teams.txt",
                  serializeTeams(store.teams),
                )
              }
            >
              Export All
            </Button>
          </Stack>
          <Typography
            variant="caption"
            component="p"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Teams are saved in this browser.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
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
