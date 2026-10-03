import { useState, type MouseEvent } from "react";
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { serializeTeam } from "@/store/team-text";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import { redoEdit, undoEdit } from "@/app/shared/history-actions";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import ToolbarButton from "./shared/ToolbarButton";

export const copyTeamText = () => {
  const { team } = store.translation.t;
  const text = serializeTeam(store.team);
  if (text === "") store.openSnackbar(team.nothingToCopy);
  else copyToClipboard(text, team.teamCopied, team.teamNotCopied);
};

// The current team's settings and text, plus importing another.
// On phones and tablets it also holds undo and redo, which the toolbar has no room for.
const ManageTeamMenu = observer(function ManageTeamMenu() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const close = () => setAnchorEl(null);
  const teamId = store.currentTeamId;

  const items = [
    ...(isMdDown ?
      [
        {
          label: t.undo,
          Icon: UndoIcon,
          act: undoEdit,
          disabled: !store.canUndo,
        },
        {
          label: t.redo,
          Icon: RedoIcon,
          act: redoEdit,
          disabled: !store.canRedo,
        },
        "divider" as const,
      ]
    : []),
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
      <ToolbarButton
        icon={<MoreHorizIcon />}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-label={t.team.manageTeamMenu}
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      >
        {t.team.manageTeam}
      </ToolbarButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        {items.map((item, i) =>
          item === "divider" ?
            <Divider key={i} />
          : <MenuItem
              key={item.label}
              disabled={"disabled" in item && item.disabled}
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
