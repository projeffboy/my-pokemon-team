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
import useFittingLabel from "./site-version-switch/use-fitting-label";

import garchompFace from "@/images/pokemon-shuffle-faces/garchomp-shuffle-face-cropped.svg";
import jigglypuffFace from "@/images/pokemon-shuffle-faces/jigglypuff-shuffle-face-cropped.svg";

const SITE_URL = "https://mypokemonteam.com/";

// A face takes its 24px plus the icon's 8px gap less its -4px outer margin
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
  // The longest label that fits the header's width with both faces. Where the button sits
  // beside the header's text, from 600px, every label fits.
  const { ref: labelRoom, label } = useFittingLabel<HTMLSpanElement>([
    "Go to the new website",
    "Go to new website",
    "New website",
  ]);
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
      <Box
        sx={{
          // Beside the header's text, the label measures the header's whole row instead
          position: { xs: "relative", sm: "static" },
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Measures the room a label has: the header's width less the button's padding and faces */}
        <Box
          component="span"
          ref={labelRoom}
          sx={theme => ({
            ...theme.typography.button,
            position: "absolute",
            insetInline: 0,
            px: `${16 + faceSpace}px`,
            visibility: "hidden",
          })}
        />
        <Button
          variant="contained"
          startIcon={face(garchompFace)}
          endIcon={face(jigglypuffFace)}
          onClick={handleSwitch}
          sx={{ whiteSpace: "nowrap", minHeight: 48, maxWidth: "100%" }}
        >
          {label}
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        slotProps={{
          transition: { onEntered: () => cancelButton.current?.focus() },
        }}
      >
        <DialogTitle id={titleId}>Switch to the new website?</DialogTitle>
        <DialogContent>
          <DialogContentText id={descriptionId}>
            Your current team won’t transfer to the new website. Save its share
            link first if you want to keep it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={cancelButton} autoFocus onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={goToSite}>Go to new website</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default SiteVersionSwitch;
