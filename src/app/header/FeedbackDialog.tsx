import { useId, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SendIcon from "@mui/icons-material/Send";
import { observer } from "mobx-react-lite";
import store from "@/store";

const EMAIL = "jeffery124@gmail.com";

// Feedback goes by email: the Send button opens the visitor's mail app with the message
// and, if they like, their team link, so a bug can be reproduced
const FeedbackDialog = observer(function FeedbackDialog() {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [attachLink, setAttachLink] = useState(true);
  const close = () => setIsOpen(false);

  const body = [
    message,
    attachLink && !store.isTeamEmpty ? `My team: ${location.href}` : "",
  ]
    .filter(part => part)
    .join("\n\n");
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent("My Pokemon Team feedback")}&body=${encodeURIComponent(body)}`;

  return (
    <>
      <Tooltip title="Send feedback">
        <Button
          variant="outlined"
          onClick={() => setIsOpen(true)}
          aria-label="Send feedback"
          sx={{ minWidth: 0, px: 1.5, flexShrink: 0 }}
        >
          <FeedbackIcon />
        </Button>
      </Tooltip>
      <Dialog open={isOpen} onClose={close} aria-labelledby={titleId} fullWidth>
        <DialogTitle id={titleId}>Send Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Found a bug or have a suggestion? Sending opens your email app with
            the message addressed to {EMAIL}. Attach your team link so problems
            can be reproduced.
          </DialogContentText>
          <TextField
            autoFocus
            label="Your feedback"
            placeholder="e.g. Meganium is missing Dazzling Gleam"
            multiline
            minRows={4}
            fullWidth
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={attachLink}
                onChange={event => setAttachLink(event.target.checked)}
              />
            }
            label="Attach my team link"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button
            href={mailto}
            disabled={!message.trim()}
            onClick={close}
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default FeedbackDialog;
