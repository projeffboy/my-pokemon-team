import Button from "@mui/material/Button";
import FileCopy from "@mui/icons-material/FileCopy";
import { observer } from "mobx-react";
import store from "@/store";
import { serializeTeamText } from "@/app/shared/team-text";

const CopyTeam = observer(function CopyTeam() {
  const handleCopy = (text: string) => {
    if (text !== "") {
      // Copied this code from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f

      let textArea = document.createElement("textarea");

      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();

      //

      store.openSnackbar("Team copied.");
    } else {
      store.openSnackbar("Empty team, nothing to copy.");
    }
  };

  return (
    <Button onClick={() => handleCopy(serializeTeamText())} sx={{ ml: 1 }}>
      Copy Team <FileCopy style={{ marginLeft: 5 }} />
    </Button>
  );
});

export default CopyTeam;
