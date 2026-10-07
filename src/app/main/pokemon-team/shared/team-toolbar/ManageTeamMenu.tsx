import { useState, type MouseEvent } from "react";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { serializeTeam } from "@/store/team-text";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import { useTranslation } from "@/app/shared/TranslationContext";
import ToolbarButton from "./shared/ToolbarButton";
import useFittingLabel from "@/app/shared/use-fitting-label";

export const copyTeamText = () => {
  const { team } = store.translation.t;
  const text = serializeTeam(store.team);
  if (text === "") store.openSnackbar(team.nothingToCopy, false, "warning");
  else copyToClipboard(text, team.teamCopied, team.teamNotCopied);
};

// The current team's text and deletion, plus importing another.
const ManageTeamMenu = observer(function ManageTeamMenu() {
  const { t } = useTranslation();
  const manage = useFittingLabel([t.team.manageTeamMenu, t.team.manageTeam]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const close = () => setAnchorEl(null);
  const teamId = store.currentTeamId;

  const items = [
    { label: t.team.copyText, Icon: ContentCopyIcon, act: copyTeamText },
    {
      label: t.team.editPokepaste,
      Icon: EditNoteIcon,
      act: () => store.openDialog("editTeam"),
    },
    { label: t.clear, Icon: DeleteIcon, act: () => setIsDeleting(true) },
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
        ref={manage.ref}
        icon={<MoreHorizIcon />}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-label={t.team.manageTeamMenu}
        data-full-label={t.team.manageTeamMenu}
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      >
        {manage.label}
      </ToolbarButton>
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
