import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Folder from "@mui/icons-material/Folder";
import FooterDialog from "./shared/FooterDialog";
import entries, { type Change, type Entry } from "./update-log/entries";

function ChangeText({ change }: { change: Change }) {
  if (typeof change === "string") return change;
  return (
    <>
      {change.text} (<Link href={change.href}>{change.credit}</Link>)
      {change.end ?? "."}
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

export default function UpdateLog() {
  return (
    <FooterDialog
      button={`Updates (${__LATEST_COMMIT_DATE__})`}
      title="Update Log"
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          href="https://github.com/projeffboy/my-pokemon-team"
          sx={{ my: 5 }}
        >
          <Folder sx={{ mr: 0.5 }} />
          GitHub Repo
        </Button>
      </Box>

      {entries.map(entry => (
        <UpdateEntry key={entry.date} {...entry} />
      ))}
    </FooterDialog>
  );
}
