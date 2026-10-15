import { useId, useState, type MouseEvent, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
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

// A titled group of the menu's items
function MenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <li role="none">
      <Box component="ul" role="group" aria-labelledby={id} sx={{ p: 0 }}>
        <ListSubheader id={id} role="presentation" disableSticky>
          {title}
        </ListSubheader>
        {children}
      </Box>
    </li>
  );
}

// The current team's text and deletion, importing another, and the accessibility
// settings. `basis` is its button's width where the toolbar is on two rows.
const MoreMenu = observer(function MoreMenu({ basis }: { basis?: string }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const close = () => setAnchorEl(null);

  const actions = [
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
    {
      label: t.team.importTeam,
      Icon: DownloadIcon,
      act: () => store.openDialog("importTeam"),
    },
  ];

  // Switches stay in the menu when flipped, so the change shows
  const settings = [
    {
      label: t.team.animateSprites,
      on: store.animateSprites,
      flip: () => (store.animateSprites = !store.animateSprites),
    },
    {
      label: t.team.showMoveTypes,
      on: store.showMoveTypes,
      flip: () => (store.showMoveTypes = !store.showMoveTypes),
    },
  ];

  return (
    <>
      <ToolbarButton
        basis={basis}
        icon={<MoreHorizIcon />}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      >
        {t.team.more}
      </ToolbarButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        <MenuSection title={t.team.manageTeam}>
          {actions.map(({ label, Icon, act }) => (
            <MenuItem
              key={label}
              onClick={() => {
                close();
                act();
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </MenuSection>
        <Divider />
        <MenuSection title={t.team.accessibility}>
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
        </MenuSection>
      </Menu>
      <DeleteTeamDialog
        teamId={deletingTeamId}
        onClose={() => setDeletingTeamId(null)}
      />
    </>
  );
});

export default MoreMenu;
