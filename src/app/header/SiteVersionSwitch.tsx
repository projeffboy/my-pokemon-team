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
import useFittingLabel from "@/app/shared/use-fitting-label";

import landorusFace from "@/images/pokemon-shuffle-faces/landorus-face-96.png";
import ogerponFace from "@/images/pokemon-shuffle-faces/ogerpon-teal-mask-by-jormxdos-96.png";

const SITE_URL = "https://old.mypokemonteam.com/";
// A face's width plus its margin from the label
const faceSpace = 28;

const face = (src: string) => (
  <Box
    component="img"
    src={src}
    alt=""
    sx={{ width: 24, height: 24, objectFit: "contain" }}
  />
);

const SiteVersionSwitch = observer(function SiteVersionSwitch() {
  const { t } = useTranslation();
  // The longest label that fits between the old website's two faces. Where even the shortest
  // does not, it keeps Landorus alone.
  const { ref: facesRoom, label: fitting } = useFittingLabel<HTMLSpanElement>([
    t.siteVersion.goLong,
    t.siteVersion.go,
    t.siteVersion.button,
    t.siteVersion.short,
    "",
  ]);
  const bothFaces = !!fitting;
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
        startIcon={bothFaces ? face(landorusFace) : undefined}
        endIcon={face(bothFaces ? ogerponFace : landorusFace)}
        onClick={handleSwitch}
        sx={{ whiteSpace: "nowrap", minHeight: 48, minWidth: 0, width: "100%" }}
      >
        <Box
          component="span"
          ref={facesRoom}
          sx={{
            position: "absolute",
            insetInline: 0,
            px: `${16 + faceSpace}px`,
          }}
        />
        <Box sx={{ display: "grid", flex: "1 1 auto", minWidth: 0 }}>
          {/* The button's column grows to fit the full label and both faces */}
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              gridArea: "1 / 1",
              visibility: "hidden",
              height: 0,
              overflow: "hidden",
              pr: `${1 + (bothFaces ? 0 : faceSpace)}px`,
            }}
          >
            {t.siteVersion.goLong}
          </Box>
          <Box component="span" sx={{ gridArea: "1 / 1", minWidth: 0 }}>
            {fitting || t.siteVersion.short}
          </Box>
        </Box>
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
