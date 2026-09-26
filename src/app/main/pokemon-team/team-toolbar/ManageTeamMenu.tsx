import { useState, type MouseEvent } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import TuneIcon from "@mui/icons-material/Tune";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { serializeTeamText } from "@/app/shared/team-text";
import copyToClipboard from "@/app/main/shared/copy-to-clipboard";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";

export const copyTeamText = () => {
  const text = serializeTeamText();
  if (text === "") store.openSnackbar("Empty team, nothing to copy.");
  else copyToClipboard(text, "Team copied.", "Could not copy the team.");
};

// The current team's settings and text, plus importing another
const ManageTeamMenu = observer(function ManageTeamMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const close = () => setAnchorEl(null);
  const teamId = store.currentTeamId;

  const items = [
    {
      label: "Name and Format",
      Icon: SettingsIcon,
      act: () => store.openDialog("teamSettings", { teamId }),
    },
    {
      label: "Duplicate",
      Icon: FileCopyIcon,
      act: () => {
        store.duplicateTeam(teamId);
        store.openSnackbar("Team duplicated");
      },
    },
    { label: "Copy text", Icon: ContentCopyIcon, act: copyTeamText },
    {
      label: "Edit Pokepaste",
      Icon: EditNoteIcon,
      act: () => store.openDialog("editTeam"),
    },
    { label: "Delete", Icon: DeleteIcon, act: () => setIsDeleting(true) },
    "divider" as const,
    {
      label: "Import team",
      Icon: DownloadIcon,
      act: () => store.openDialog("importTeam"),
    },
  ];

  return (
    <>
      <Button
        startIcon={<TuneIcon />}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-label="Manage team"
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      >
        Manage Team
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        {items.map((item, i) =>
          item === "divider" ?
            <Divider key={i} />
          : <MenuItem
              key={item.label}
              onClick={() => {
                close();
                item.act();
              }}
            >
              <ListItemIcon>
                <item.Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>,
        )}
      </Menu>
      <DeleteTeamDialog
        teamId={isDeleting ? teamId : null}
        onClose={() => setIsDeleting(false)}
      />
    </>
  );
});

export default ManageTeamMenu;
