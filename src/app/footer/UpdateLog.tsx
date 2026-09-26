import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Folder from "@mui/icons-material/Folder";
import entries, { type Change, type Entry } from "./update-log/entries";
import { useTranslation } from "@/app/shared/TranslationContext";

const changeKey = (change: Change) =>
  typeof change === "string" ? change : change.text;

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
      <Typography variant="subtitle2" component="h3">
        {entry.date}
      </Typography>
      {isList ?
        <Typography component="ul" sx={{ pl: 3, mb: 2 }}>
          {changes.map(change => (
            <li key={changeKey(change)}>
              <ChangeText change={change} />
            </li>
          ))}
        </Typography>
      : changes.map(change => (
          <Typography key={changeKey(change)} sx={{ mb: 2 }}>
            <ChangeText change={change} />
          </Typography>
        ))
      }
    </>
  );
}

// The entries themselves stay in English
export default function UpdateLog() {
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          href="https://github.com/projeffboy/my-pokemon-team"
          sx={{ my: 5 }}
        >
          <Folder sx={{ mr: 0.5 }} />
          {t.footer.githubRepo}
        </Button>
      </Box>

      {entries.map(entry => (
        <UpdateEntry key={entry.date} {...entry} />
      ))}
    </>
  );
}
