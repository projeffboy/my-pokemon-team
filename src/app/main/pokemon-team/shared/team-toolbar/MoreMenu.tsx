import { useId, useState, type MouseEvent, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { observer } from "mobx-react-lite";
import store from "@/store";
import DeleteTeamDialog from "@/app/shared/DeleteTeamDialog";
import { useTranslation } from "@/app/shared/TranslationContext";
import ToolbarButton from "./shared/ToolbarButton";

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

// The current team's import and export, its deletion, and the accessibility
// settings. `basis` is its button's width where the toolbar is on two rows.
const MoreMenu = observer(function MoreMenu({ basis }: { basis?: string }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const close = () => setAnchorEl(null);

  const actions = [
    {
      label: t.importDialog.title,
      Icon: ImportExportIcon,
      act: () => store.openDialog("importExport"),
    },
    {
      label: t.clear,
      Icon: DeleteIcon,
      act: () => setDeletingTeamId(store.currentTeamId),
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
      label: t.team.showTypes,
      on: store.showTypes,
      flip: () => (store.showTypes = !store.showTypes),
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
              {/* Only shows the state: the menu item is the checkbox */}
              <Switch
                edge="end"
                size="small"
                checked={on}
                inert
                sx={{ ml: 2 }}
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
