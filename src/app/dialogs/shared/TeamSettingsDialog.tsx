import { useId, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { Generation, SavedTeam } from "@/types";
import { FORMATS } from "@/shared/formats";
import {
  GENERATION_GAMES,
  GENERATIONS,
  generationLabel,
  isGeneration,
} from "@/shared/generations";
import { validateTeam } from "@/store/validation";

const TeamSettingsForm = observer(function TeamSettingsForm({
  team,
  titleId,
  onClose,
}: {
  team: SavedTeam;
  titleId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState(team.name);
  const [generation, setGeneration] = useState<Generation>(team.generation);
  const [format, setFormat] = useState(team.format);
  const [problems, setProblems] = useState<string[] | null>(null);
  const where = `${generationLabel(generation)}${format ? ` ${format}` : ""}`;

  const handleSave = () => {
    store.setTeamSettings(team.id, { name: name.trim(), generation, format });
    onClose();
  };

  return (
    <>
      <DialogTitle id={titleId}>Name and Format</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            label="Team name"
            value={name}
            onChange={event => setName(event.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={1.5}>
            <TextField
              select
              label="Generation"
              value={generation}
              onChange={event => {
                const value = Number(event.target.value);
                if (isGeneration(value)) setGeneration(value);
              }}
              fullWidth
            >
              {GENERATIONS.map(generation => (
                <MenuItem key={generation} value={generation}>
                  {generationLabel(generation)} (
                  {GENERATION_GAMES[generation].short})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Format"
              value={format}
              onChange={event => setFormat(event.target.value)}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {FORMATS.map(format => (
                <MenuItem key={format} value={format}>
                  {format}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<FactCheckIcon />}
            onClick={() =>
              setProblems(validateTeam(team.team, generation, format))
            }
          >
            Check team for {where}
          </Button>
          {problems && (
            <Alert severity={problems.length ? "warning" : "success"}>
              {problems.length ?
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {problems.map(problem => (
                    <li key={problem}>{problem}</li>
                  ))}
                </Box>
              : `The team is valid for ${where}.`}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </>
  );
});

// A saved team's name, generation, and format, with a legality check
const TeamSettingsDialog = observer(function TeamSettingsDialog({
  teamId,
  onClose,
}: {
  teamId: string | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const team = store.teams.find(team => team.id === teamId);

  return (
    <Dialog
      open={!!team}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      {team && (
        <TeamSettingsForm
          key={team.id}
          team={team}
          titleId={titleId}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
});

export default TeamSettingsDialog;
