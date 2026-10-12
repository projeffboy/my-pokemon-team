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

import versionFace from "@/images/pokemon-shuffle-faces/garchomp-shuffle-face-cropped.svg";

const SITE_URL = "https://mypokemonteam.com/";

const SiteVersionSwitch = observer(function SiteVersionSwitch() {
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
        sx={{ alignSelf: "center", whiteSpace: "nowrap", minHeight: 48 }}
      >
        New website
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
