import Button from "@mui/material/Button";
import FileCopy from "@mui/icons-material/FileCopy";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { serializeTeamText } from "@/app/shared/team-text";
import copyToClipboard from "@/app/main/shared/copy-to-clipboard";

const CopyTeam = observer(function CopyTeam() {
  const handleCopy = () => {
    const text = serializeTeamText();
    if (text === "") store.openSnackbar("Empty team, nothing to copy.");
    else copyToClipboard(text, "Team copied.", "Could not copy the team.");
  };

  return (
    <Button onClick={handleCopy} sx={{ ml: 1 }}>
      Copy Team <FileCopy sx={{ ml: 0.5 }} />
    </Button>
  );
});

export default CopyTeam;
