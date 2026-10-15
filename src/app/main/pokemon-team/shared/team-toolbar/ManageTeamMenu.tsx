import { useState, type MouseEvent } from "react";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
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
  const text = serializeTeam(
    store.team,
    store.currentTeam.generation,
    store.currentTeam.format,
  );
  if (text === "") store.openSnackbar(team.nothingToCopy, false, "warning");
  else copyToClipboard(text, team.teamCopied, team.teamNotCopied);
};

// The current team's text and deletion, importing another, and the display settings.
// `basis` is its button's width where the toolbar is on two rows.
const ManageTeamMenu = observer(function ManageTeamMenu({
  basis,
}: {
  basis?: string;
}) {
  const { t } = useTranslation();
  const manage = useFittingLabel([t.team.manageTeamMenu, t.team.manageTeam]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const close = () => setAnchorEl(null);

  const items = [
    { label: t.team.copyText, Icon: ContentCopyIcon, act: copyTeamText },
    {
      label: t.team.editPokepaste,
      Icon: EditNoteIcon,
      act: () => store.openDialog("editTeam"),
    },
    {
      label: t.clear,
      Icon: DeleteIcon,
      act: () => setDeletingTeamId(store.currentTeamId),
    },
    "divider" as const,
    {
      label: t.team.importTeam,
      Icon: DownloadIcon,
      act: () => store.openDialog("importTeam"),
    },
  ];

  // Switches stay in the menu when flipped, so the change shows
  const settings = [
    {
      label: t.team.showMoveTypes,
      on: store.showMoveTypes,
      flip: () => (store.showMoveTypes = !store.showMoveTypes),
    },
  ];

  return (
    <>
      <ToolbarButton
        ref={manage.ref}
        basis={basis}
        icon={<MoreHorizIcon />}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-label={t.team.manageTeamMenu}
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
        <Divider />
        {settings.map(({ label, on, flip }) => (
          <MenuItem
            key={label}
            role="menuitemcheckbox"
            aria-checked={on}
            onClick={flip}
          >
            <ListItemText>{label}</ListItemText>
            <Switch
              edge="end"
              size="small"
              checked={on}
              tabIndex={-1}
              slotProps={{ input: { "aria-hidden": true } }}
              sx={{ ml: 2, pointerEvents: "none" }}
            />
          </MenuItem>
        ))}
      </Menu>
      <DeleteTeamDialog
        teamId={deletingTeamId}
        onClose={() => setDeletingTeamId(null)}
      />
    </>
  );
});

export default ManageTeamMenu;
