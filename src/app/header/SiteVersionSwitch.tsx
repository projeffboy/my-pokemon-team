import { useId, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import { useBreakpoint } from "@/app/shared/WidthContext";
import useFittingLabel from "@/app/shared/use-fitting-label";

import versionFace from "@/images/pokemon-shuffle-faces/landorus-face.png";

const SITE_URL = "https://old.mypokemonteam.com/";

const SiteVersionSwitch = observer(function SiteVersionSwitch() {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const labels =
    breakpoint === "sm" ?
      [t.siteVersion.goLong, t.siteVersion.go, t.siteVersion.button]
    : breakpoint === "xs" ? [t.siteVersion.go]
    : breakpoint === "xxs" ? [t.siteVersion.button]
    : [t.siteVersion.goLong];
  const { ref: labelRef, label } = useFittingLabel<HTMLSpanElement>(labels);
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
        endIcon={
          <Box
            component="img"
            src={versionFace}
            alt=""
            sx={{ width: 24, height: 24, objectFit: "contain" }}
          />
        }
        onClick={handleSwitch}
        sx={{
          whiteSpace: "nowrap",
          minHeight: 48,
          minWidth: { sm: 0, md: 64 },
          maxWidth: { sm: "100%", md: "none" },
          width: { xxs: "auto", sm: "100%", md: "auto" },
        }}
      >
        {breakpoint === "sm" ?
          <Box sx={{ display: "grid", flex: "1 1 auto", minWidth: 0 }}>
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                gridArea: "1 / 1",
                visibility: "hidden",
                height: 0,
                overflow: "hidden",
                pr: 0.125,
              }}
            >
              {t.siteVersion.goLong}
            </Box>
            <Box
              component="span"
              ref={labelRef}
              sx={{ gridArea: "1 / 1", minWidth: 0 }}
            >
              {label}
            </Box>
          </Box>
        : labels[0]}
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
