import { useState, type MouseEvent } from "react";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";
import TranslateIcon from "@mui/icons-material/Translate";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { LOCALE_NAMES, LOCALES } from "@/i18n/locales";
import { useTranslation } from "@/app/shared/TranslationContext";

// The site's language, listed in each language's own name
const LanguageSelect = observer(function LanguageSelect() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title={t.language}>
        <Button
          variant="outlined"
          onClick={(event: MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
          aria-label={t.language}
          aria-haspopup="menu"
          aria-expanded={!!anchorEl}
          sx={{ minWidth: 0, px: 1.5, flexShrink: 0 }}
        >
          <TranslateIcon />
        </Button>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        {LOCALES.map(locale => (
          <MenuItem
            key={locale}
            selected={locale === store.locale}
            lang={locale}
            onClick={() => {
              store.locale = locale;
              close();
            }}
          >
            <ListItemIcon>
              {locale === store.locale && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{LOCALE_NAMES[locale]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

export default LanguageSelect;
