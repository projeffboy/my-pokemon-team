import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";
import { rulesLabel } from "@/store/validation";

// Each rule the current team breaks, or that it breaks none. An empty team has
// nothing to check, so it shows nothing.
const TeamProblems = observer(function TeamProblems({
  sx,
}: {
  sx?: SxProps<Theme>;
}) {
  const translation = useTranslation();
  const { t } = translation;
  const problems = store.teamProblems;
  if (!problems || store.isTeamEmpty) return null;

  return (
    <Alert
      severity={problems.length ? "warning" : "success"}
      role="status"
      aria-label={t.validation.teamProblems}
      sx={sx}
    >
      {problems.length ?
        <>
          <AlertTitle>{t.validation.problemCount(problems.length)}</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {problems.map(({ message }) => (
              <li key={message}>{message}</li>
            ))}
          </Box>
        </>
      : t.validation.noProblems(
          rulesLabel(
            store.currentTeam.generation,
            store.dataFormat,
            translation,
          ),
        )
      }
    </Alert>
  );
});

export default TeamProblems;
