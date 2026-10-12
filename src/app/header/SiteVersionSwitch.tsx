import { useId, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

const SITE_URL = "https://old.mypokemonteam.com/";

const SiteVersionSwitch = observer(function SiteVersionSwitch() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const goToSite = () => location.assign(SITE_URL);

  const handleSwitch = () => {
    if (store.isTeamEmpty) goToSite();
    else setOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleSwitch}
        sx={{ whiteSpace: "nowrap" }}
      >
        {t.siteVersion.button}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        slotProps={{
          transition: { onEntered: () => cancelButton.current?.focus() },
        }}
      >
        <DialogTitle id={titleId}>{t.siteVersion.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id={descriptionId}>
            {t.siteVersion.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={cancelButton} autoFocus onClick={() => setOpen(false)}>
            {t.cancel}
          </Button>
          <Button onClick={goToSite}>{t.siteVersion.go}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default SiteVersionSwitch;
