import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { typesIn } from "@/shared/generation-data";
import {
  coverageMatrix,
  defenceMatrix,
  formatMultiplier,
  type MatrixCell,
} from "@/store/matrix";
import PokemonIcon from "@/app/shared/PokemonIcon";
import { useTranslation } from "@/app/shared/TranslationContext";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import TypeLabel from "./shared/TypeLabel";
import useTypeColumnLayout from "./matrix-analysis/use-type-column-layout";

export type MatrixKind = "defence" | "coverage";

// The cell background: red for the bad outcome and teal for the good one, deeper
// the further from neutral, so an immunity is the deepest. A strong hit is bad on
// the team's defence and good for its coverage.
const cellColor = (
  multiplier: number,
  kind: MatrixKind,
  palette: { error: string; success: string },
) => {
  if (multiplier === 1) return "transparent";
  const isGood = kind === "defence" ? multiplier < 1 : multiplier > 1;
  const opacity =
    multiplier === 0 ? 0.8
    : multiplier >= 4 || multiplier <= 0.25 ? 0.55
    : 0.3;
  return alpha(isGood ? palette.success : palette.error, opacity);
};

// The tooltip sits a quarter of a 32px cell away from its cell, instead of MUI's 14px
const tooltipGap = {
  [`.${tooltipClasses.popper}[data-popper-placement*="top"] &`]: { mb: 1 },
  [`.${tooltipClasses.popper}[data-popper-placement*="bottom"] &`]: { mt: 1 },
};

// A tooltip in one of the matrix's columns. It sits above its cell and is transparent
// to the pointer, so it never blocks the rows below, and it lines up with the cell's
// outer edge, growing towards the middle of the table.
const tooltipProps = (isLeftHalf: boolean) =>
  ({
    placement: isLeftHalf ? "top-start" : "top-end",
    disableInteractive: true,
    enterTouchDelay: 0,
    slotProps: {
      tooltip: {
        sx: { ...tooltipGap, textAlign: isLeftHalf ? "left" : "right" },
      },
    },
  }) as const;

const formatScore = (score: number) => (score > 0 ? `+${score}` : `${score}`);

// Every type against every pokemon on the team, in one table, with the team's score
// for each type at the end of its row. Tap a cell for the reason.
const MatrixAnalysis = observer(function MatrixAnalysis({
  kind,
  onKindChange,
}: {
  kind: MatrixKind;
  onKindChange: (kind: MatrixKind) => void;
}) {
  const translation = useTranslation();
  const { t, names } = translation;
  const isDefence = kind === "defence";
  const { generation } = store.currentTeam;
  const matrix =
    isDefence ?
      defenceMatrix(store.analysisTeam, translation, generation)
    : coverageMatrix(store.analysisTeam, translation, generation);
  const scores = isDefence ? store.typeDefence : store.typeCoverage;
  // Empty slots get no column
  const slots = store.analysisTeam.flatMap(({ name }, slot) =>
    name ? [{ name, slot }] : [],
  );
  const types = typesIn(generation);
  const { tableRef, hasIcon, showFullName, columnWidth } = useTypeColumnLayout(
    JSON.stringify(
      types.map(type => [names.type(type), t.typeAbbreviations[type]]),
    ),
    slots.length,
  );
  const isLeftHalf = (column: number) => column < slots.length / 2;
  // A darker shade is the same outcome at four times or a quarter
  const legend = [
    {
      multiplier: 2,
      label: isDefence ? t.matrix.weak : t.matrix.superEffective,
    },
    {
      multiplier: 0.5,
      label: isDefence ? t.matrix.resists : t.matrix.resisted,
    },
    { multiplier: 0, label: isDefence ? t.matrix.immune : t.matrix.noEffect },
  ];

  const cellSx = (cell: MatrixCell) => ({
    textAlign: "center",
    px: 0.25,
    py: { xxs: 0.5, sm: 0.25 },
    height: { xxs: 32, sm: 24 },
    fontWeight: 500,
    cursor: "pointer",
    // Outlines the cell whose reason is showing; a tapped cell stays hovered on a phone
    "&:hover, &:focus-visible": {
      outline: 2,
      outlineColor: "text.primary",
      outlineOffset: -2,
    },
    bgcolor: (theme: {
      palette: { error: { main: string }; success: { main: string } };
    }) =>
      cellColor(cell.multiplier, kind, {
        error: theme.palette.error.main,
        success: theme.palette.success.main,
      }),
  });

  // Green for a good score and red for a bad one, as in the team stats. A type that
  // no move is super effective against is a gap in the coverage.
  const scoreColor = (score: number) =>
    score > 0 ? "success.main"
    : score < 0 || !isDefence ? "error.main"
    : "inherit";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={kind}
        onChange={(_event, value: MatrixKind | null) => {
          if (value) onKindChange(value);
        }}
        aria-label={t.matrix.matrix}
        fullWidth
      >
        <ToggleButton value="defence">{t.stats.defence}</ToggleButton>
        <ToggleButton value="coverage">{t.stats.coverage}</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        {isDefence ? t.matrix.defenceDescription : t.matrix.coverageDescription}{" "}
        {slots.length > 0 ? t.matrix.tapForReason : t.stats.selectPokemonFirst}
      </Typography>
      {slots.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1.5,
              fontSize: 12,
            }}
          >
            {legend.map(({ multiplier, label }) => (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Box
                  sx={theme => ({
                    width: 14,
                    height: 14,
                    borderRadius: 0.5,
                    bgcolor: cellColor(multiplier, kind, {
                      error: theme.palette.error.main,
                      success: theme.palette.success.main,
                    }),
                  })}
                />
                {label}
              </Box>
            ))}
          </Box>
          <Table
            ref={tableRef}
            size="small"
            stickyHeader
            sx={{
              tableLayout: "fixed",
              // The pinned icon row matches the panel, lightened like it in the dark scheme
              "& thead th": {
                bgcolor: "background.paper",
                backgroundImage: "var(--Paper-overlay)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: columnWidth, p: 0 }} />
                {slots.map(({ name, slot }, column) => (
                  // Hovering or tapping a pokemon's icon names it
                  <Tooltip
                    key={slot}
                    title={names.pokemon(name)}
                    {...tooltipProps(isLeftHalf(column))}
                  >
                    <TableCell
                      tabIndex={0}
                      aria-label={t.matrix.slot(slot + 1, names.pokemon(name))}
                      sx={{ p: 0, cursor: "pointer" }}
                    >
                      {/* An icon wider than its column overlaps its neighbours' blank edges */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          "& > *": { flexShrink: 0 },
                        }}
                      >
                        <PokemonIcon pokemonProperty="name" value={name} />
                      </Box>
                    </TableCell>
                  </Tooltip>
                ))}
                <Tooltip title={t.matrix.teamScore} {...tooltipProps(false)}>
                  <TableCell
                    tabIndex={0}
                    aria-label={t.matrix.teamScore}
                    sx={{
                      width: 40,
                      p: 0,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    Σ
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map(type => (
                <TableRow key={type}>
                  <TableCell component="th" scope="row" sx={{ p: 0.25 }}>
                    <Box
                      sx={{
                        bgcolor: TYPE_COLORS[type],
                        color: TYPE_TEXT_COLORS[type],
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 500,
                        textAlign: "center",
                        lineHeight: "22px",
                      }}
                      aria-label={names.type(type)}
                    >
                      <TypeLabel
                        type={type}
                        name={names.type(type)}
                        abbreviation={
                          t.typeAbbreviations[type] ?? names.type(type)
                        }
                        hasIcon={hasIcon}
                        showFullName={showFullName}
                      />
                    </Box>
                  </TableCell>
                  {slots.map(({ slot }, column) => {
                    const cell = matrix[type]?.[slot];
                    return (
                      cell && (
                        <Tooltip
                          key={slot}
                          title={cell.reason}
                          {...tooltipProps(isLeftHalf(column))}
                        >
                          <TableCell
                            tabIndex={0}
                            aria-label={cell.reason}
                            sx={cellSx(cell)}
                          >
                            {formatMultiplier(cell.multiplier)}
                          </TableCell>
                        </Tooltip>
                      )
                    );
                  })}
                  <TableCell
                    aria-label={t.stats.score(
                      names.type(type),
                      formatScore(scores[type]),
                    )}
                    sx={{
                      textAlign: "center",
                      px: 0.25,
                      py: { xxs: 0.5, sm: 0.25 },
                      borderLeft: 1,
                      borderLeftColor: "divider",
                      fontWeight: 500,
                      color: scoreColor(scores[type]),
                    }}
                  >
                    {formatScore(scores[type])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
});

export default MatrixAnalysis;
