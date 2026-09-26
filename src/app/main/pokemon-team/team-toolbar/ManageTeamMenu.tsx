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
import { useTranslation } from "@/app/shared/TranslationContext";

export const copyTeamText = () => {
  const { team } = store.translation.t;
  const text = serializeTeamText();
  if (text === "") store.openSnackbar(team.nothingToCopy);
  else copyToClipboard(text, team.teamCopied, team.teamNotCopied);
};

// The current team's settings and text, plus importing another
const ManageTeamMenu = observer(function ManageTeamMenu() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const close = () => setAnchorEl(null);
  const teamId = store.currentTeamId;

  const items = [
    {
      label: t.team.nameAndFormat,
      Icon: SettingsIcon,
      act: () => store.openDialog("teamSettings", { teamId }),
    },
    {
      label: t.team.duplicate,
      Icon: FileCopyIcon,
      act: () => {
        store.duplicateTeam(teamId);
        store.openSnackbar(t.team.teamDuplicated);
      },
    },
    { label: t.team.copyText, Icon: ContentCopyIcon, act: copyTeamText },
    {
      label: t.team.editPokepaste,
      Icon: EditNoteIcon,
      act: () => store.openDialog("editTeam"),
    },
    { label: t.team.delete, Icon: DeleteIcon, act: () => setIsDeleting(true) },
    "divider" as const,
    {
      label: t.team.importTeam,
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
        aria-label={t.team.manageTeamMenu}
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      >
        {t.team.manageTeam}
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
