import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@/app/shared/TranslationContext";
import { encodeTeamForUrl } from "@/app/shared/team-link";

// Production snapshot: ca23d6b55ea96d9bf37022c094f6945d8e6420d3.
const OLD_VERSION_URL =
  "https://my-pokemon-team-9tnxdj5hn-jeffery-tangs-projects.vercel.app/";

const OldVersionButton = observer(function OldVersionButton() {
  const { t } = useTranslation();
  const url = new URL(OLD_VERSION_URL);
  const team = encodeTeamForUrl();
  if (team) url.searchParams.set("team", team);

  return (
    <Button variant="footer" href={url.href}>
      {t.footer.oldVersion}
    </Button>
  );
});

export default OldVersionButton;
