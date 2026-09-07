import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

function PrivacyPolicy() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Button
        onClick={toggleDialog}
        style={{ fontWeight: "initial", textTransform: "initial" }}
      >
        Privacy Policy
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Privacy Policy</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            All or partial advertising on this Website or App is managed by
            Playwire LLC. If Playwire publisher advertising services are used,
            Playwire LLC may collect and use certain aggregated and anonymized
            data for advertising purposes. To learn more about the types of data
            collected, how data is used and your choices as a user, please visit{" "}
            <a href="https://www.playwire.com/privacy-policy">
              https://www.playwire.com/privacy-policy
            </a>
            .
          </Typography>
          <Typography paragraph>
            <a href="http://www.playwire.com" rel="noopener" target="_blank">
              <img
                src="https://www.playwire.com/hubfs/Powered-by-Playwire-Badges/Ads-Powered-by-playwire-2021-standalone-large-300px.png"
                alt="Playwire"
                width="200"
                loading="lazy"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                }}
              />
            </a>
          </Typography>
          <Typography paragraph align="center">
            <a
              href="https://www.playwire.com/contact-direct-sales"
              rel="noopener"
            >
              Advertise on this site.
            </a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PrivacyPolicy;
