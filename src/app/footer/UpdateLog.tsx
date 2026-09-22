import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Folder from "@mui/icons-material/Folder";
import entries, { type Change, type Entry } from "./update-log/entries";

function ChangeText({ change }: { change: Change }) {
  if (typeof change === "string") return change;
  return (
    <>
      {change.text} (
      <Link style={{ color: "#2196f3" }} href={change.href}>
        {change.credit}
      </Link>
      ){change.end ?? "."}
    </>
  );
}

function UpdateEntry(entry: Entry) {
  const changes = "changes" in entry ? entry.changes : entry.paragraphs;
  const isList = "changes" in entry && changes.length > 1;
  return (
    <>
      <Typography variant="subtitle2">{entry.date}</Typography>
      {isList ?
        <Typography component="ul" sx={{ pl: 3, mb: 2 }}>
          {changes.map((change, i) => (
            <li key={i}>
              <ChangeText change={change} />
            </li>
          ))}
        </Typography>
      : changes.map((change, i) => (
          <Typography key={i} paragraph>
            <ChangeText change={change} />
          </Typography>
        ))
      }
    </>
  );
}

function UpdateLog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Button
        onClick={toggleDialog}
        style={{ fontWeight: "initial", textTransform: "initial" }}
      >
        Updates ({__LATEST_COMMIT_DATE__})
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
        style={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id="form-dialog-title">Update Log</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="outlined"
              href="https://github.com/projeffboy/my-pokemon-team"
              sx={{ my: 5 }}
            >
              <Folder style={{ marginRight: 5 }} />
              GitHub Repo
            </Button>
          </div>

          {entries.map(entry => (
            <UpdateEntry key={entry.date} {...entry} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateLog;
