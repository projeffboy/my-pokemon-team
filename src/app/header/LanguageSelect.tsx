import { useState, type MouseEvent } from "react";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import LanguageIcon from "@mui/icons-material/Language";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { LOCALE_CODES, LOCALE_NAMES, LOCALES } from "@/i18n/locales";
import { useTranslation } from "@/app/shared/TranslationContext";
import CaptionButton from "./shared/CaptionButton";

// The site's language, listed in each language's own name
const LanguageSelect = observer(function LanguageSelect() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      <CaptionButton
        icon={<LanguageIcon />}
        caption={LOCALE_CODES[store.locale]}
        label={t.language}
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
      />
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={close}
        slotProps={{ paper: { sx: { width: 220 } } }}
      >
        {LOCALES.map(locale => (
          <MenuItem
            key={locale}
            selected={locale === store.locale}
            lang={locale}
            onClick={() => {
              store.chooseLocale(locale);
              close();
            }}
          >
            <ListItemText>{LOCALE_NAMES[locale]}</ListItemText>
            {locale === store.locale && <CheckIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

export default LanguageSelect;
