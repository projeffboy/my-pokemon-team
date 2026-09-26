import { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { POKEMON_TYPES } from "@/types";
import { pokemonName } from "@/shared/names";
import {
  coverageMatrix,
  defenceMatrix,
  formatMultiplier,
  type MatrixCell,
} from "@/store/matrix";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import { TYPE_ABBREVIATIONS, TYPE_COLORS } from "./shared/type-colors";

type MatrixKind = "defence" | "coverage";

const DESCRIPTIONS: Record<MatrixKind, string> = {
  defence: "How hard each attacking type hits each pokemon.",
  coverage: "How hard each pokemon's best move hits each type.",
};

const LEGEND = [
  { multiplier: 2, label: "×2 weak" },
  { multiplier: 4, label: "×4" },
  { multiplier: 0.5, label: "½ resists" },
  { multiplier: 0.25, label: "¼" },
  { multiplier: 0, label: "0 immune" },
];

// The cell background: red for super effective, teal for resisted, grey for immune
const cellColor = (
  multiplier: number,
  palette: { error: string; success: string; immune: string },
) => {
  if (multiplier === 0) return palette.immune;
  if (multiplier > 1) return alpha(palette.error, multiplier >= 4 ? 0.55 : 0.3);
  if (multiplier < 1)
    return alpha(palette.success, multiplier <= 0.25 ? 0.55 : 0.3);
  return "transparent";
};

// Every type against every slot, in one table. Tap a cell for the reason.
const MatrixAnalysis = observer(function MatrixAnalysis() {
  const [kind, setKind] = useState<MatrixKind>("defence");
  const matrix =
    kind === "defence" ? defenceMatrix(store.team) : coverageMatrix(store.team);

  const cellSx = (cell: MatrixCell | null) => ({
    textAlign: "center",
    px: 0.25,
    py: 0.5,
    fontWeight: 500,
    cursor: cell ? "help" : "default",
    bgcolor: (theme: {
      palette: {
        error: { main: string };
        success: { main: string };
        action: { disabledBackground: string };
      };
    }) =>
      cell ?
        cellColor(cell.multiplier, {
          error: theme.palette.error.main,
          success: theme.palette.success.main,
          immune: theme.palette.action.disabledBackground,
        })
      : "transparent",
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={kind}
        onChange={(_event, value: MatrixKind | null) => {
          if (value) setKind(value);
        }}
        aria-label="Matrix"
        sx={{ alignSelf: "center" }}
      >
        <ToggleButton value="defence">Defence</ToggleButton>
        <ToggleButton value="coverage">Coverage</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        {DESCRIPTIONS[kind]} Tap a cell for the reason.
      </Typography>
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 44, p: 0 }} />
            {store.team.map(({ name }, i) => (
              <TableCell
                key={i}
                aria-label={`Slot ${i + 1}${name ? `: ${pokemonName(name) ?? name}` : ""}`}
                sx={{ textAlign: "center", p: 0 }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {name ?
                    <PokemonIcon pokemonProperty="name" value={name} />
                  : <Box component="span" sx={{ color: "text.disabled" }}>
                      ?
                    </Box>
                  }
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {POKEMON_TYPES.map(type => (
            <TableRow key={type}>
              <TableCell component="th" scope="row" sx={{ p: 0.25 }}>
                <Box
                  sx={{
                    bgcolor: TYPE_COLORS[type],
                    color: "common.white",
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 500,
                    textAlign: "center",
                    lineHeight: "22px",
                  }}
                  aria-label={type}
                >
                  {TYPE_ABBREVIATIONS[type]}
                </Box>
              </TableCell>
              {matrix[type].map((cell, i) => (
                <Tooltip
                  key={i}
                  title={cell?.reason ?? ""}
                  enterTouchDelay={0}
                  disableHoverListener={!cell}
                  disableTouchListener={!cell}
                  disableFocusListener={!cell}
                >
                  <TableCell
                    tabIndex={cell ? 0 : undefined}
                    aria-label={cell ? cell.reason : undefined}
                    sx={cellSx(cell)}
                  >
                    {cell ? formatMultiplier(cell.multiplier) : ""}
                  </TableCell>
                </Tooltip>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1.5,
          fontSize: 12,
        }}
      >
        {LEGEND.map(({ multiplier, label }) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              sx={theme => ({
                width: 14,
                height: 14,
                borderRadius: 0.5,
                bgcolor: cellColor(multiplier, {
                  error: theme.palette.error.main,
                  success: theme.palette.success.main,
                  immune: theme.palette.action.disabledBackground,
                }),
              })}
            />
            {label}
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default MatrixAnalysis;
