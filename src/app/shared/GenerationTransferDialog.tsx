import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Fragment, useId } from "react";
import { useTranslation } from "@/app/shared/TranslationContext";
import PokemonIcon from "./PokemonIcon";
import { useIsSmDown } from "./WidthContext";
import DialogHeader from "./DialogHeader";
import GameLogos from "./GameLogos";
import ScrollContent from "./generation-transfer-dialog/ScrollContent";
import AdjustmentDetails from "./generation-transfer-dialog/AdjustmentDetails";
import RemovedEntries from "./generation-transfer-dialog/RemovedEntries";
import TransferEndpoint from "./generation-transfer-dialog/TransferEndpoint";
import { universalTransferChanges } from "@/store/generation-transfer/universal-changes";
import type { GameLogo } from "@/images/game-logos";
import type { TransferLoss } from "@/store/generation-transfer";
import type { Generation, ReadonlyTeam } from "@/types";

export default function GenerationTransferDialog({
  from,
  fromGeneration,
  fromFormat,
  toGeneration,
  toFormat,
  hasCarryover,
  where,
  games,
  fromLogos,
  toLogos,
  losses,
  team,
  onCancel,
  onModify,
  onNew,
}: {
  from: string;
  fromGeneration: Generation;
  fromFormat: string;
  toGeneration: Generation;
  toFormat: string;
  hasCarryover: boolean;
  where: string;
  games?: string;
  fromLogos: GameLogo[];
  toLogos: GameLogo[];
  losses: TransferLoss[];
  team: ReadonlyTeam;
  onCancel: () => void;
  onModify: () => void;
  onNew: () => void;
}) {
  const { t, names, locale } = useTranslation();
  const compact = useIsSmDown();
  const titleId = useId();
  const destinationId = useId();
  const summaryId = useId();
  const universalId = useId();
  const text = t.generationTransfer;
  const destination = where.split(" · ").at(-1) ?? where;
  const valueName = (loss: TransferLoss) => {
    const value = loss.value ?? "";
    return (
      loss.field === "move" ? names.move(value)
      : loss.field === "item" ? names.item(value)
      : loss.field === "ability" ? names.ability(value)
      : loss.field === "pokemon" ? ""
      : t.advanced[loss.field]
    );
  };
  const unavailable = new Set(
    losses
      .filter(loss => loss.field === "pokemon" && !loss.replacement)
      .map(loss => loss.index),
  );
  const universal = universalTransferChanges(
    { generation: fromGeneration, format: fromFormat },
    { generation: toGeneration, format: toFormat },
    team.filter((_, index) => !unavailable.has(index)),
  );
  const universalMessages = [
    ...(universal.fixedLevel !== undefined ?
      [text.levelSet(universal.fixedLevel)]
    : []),
    ...(universal.removed.filter(field => field !== "ivs").length ?
      [
        text.featuresUnused(
          new Intl.ListFormat(locale, { type: "conjunction" }).format(
            universal.removed
              .filter(field => field !== "ivs")
              .map(field =>
                field === "item" ? t.team.item
                : field === "ability" ? t.team.ability
                : t.advanced[field],
              ),
          ),
          destination,
        ),
      ]
    : []),
    ...(universal.removed.includes("ivs") ? [text.ivsUnused(destination)] : []),
    ...(universal.ivsConversion ?
      [
        universal.ivsConversion === "dvs" ?
          text.ivsConvertedToDvs
        : text.dvsConvertedToIvs,
      ]
    : []),
    ...(universal.training ?
      [
        text.trainingSystemChanges(
          t.advanced[universal.training.from],
          t.advanced[universal.training.to],
        ),
      ]
    : []),
  ];
  const individualLosses = losses.filter(loss => !universal.isUniversal(loss));
  const categories = ["pokemon", "move", "item", "ability"] as const;
  const removals = individualLosses.filter(
    loss =>
      loss.replacement === undefined &&
      !loss.conversion &&
      loss.field !== "ivs",
  );
  const adjustments = individualLosses.filter(
    loss =>
      loss.replacement !== undefined || loss.conversion || loss.field === "ivs",
  );
  const unavailableHeading =
    hasCarryover ? text.unavailableHeading : text.allUnavailableHeading;
  const adjustedHeading =
    unavailable.size > 0 ? text.remainingAdjustedHeading : text.adjustedHeading;
  const isDetail = (loss: TransferLoss) =>
    !categories.some(category => category === loss.field);
  const list = new Intl.ListFormat(locale, { type: "conjunction" });
  const members = team.filter(member => member.name).length;
  const removedCounts = categories.flatMap(category => {
    const count =
      category === "pokemon" ?
        unavailable.size
      : losses.filter(
          loss => loss.field === category && loss.replacement === undefined,
        ).length;
    return count ? [text.counts[category](count)] : [];
  });
  const summary = [
    text.carryOverSummary(
      members - unavailable.size,
      text.counts.pokemon(members),
    ),
    ...(removedCounts.length ?
      [text.removedSummary(list.format(removedCounts))]
    : []),
  ].join(" · ");
  const slots = [...new Set(losses.map(loss => loss.index))]
    .filter(index => !unavailable.has(index))
    .sort((a, b) => a - b);
  const individualSlots = slots.filter(index =>
    [...removals, ...adjustments].some(loss => loss.index === index),
  );
  const pokemonHeading = (loss: TransferLoss) => (
    <Typography component="h3" variant="subtitle2">
      {names.pokemon(loss.pokemon)}
    </Typography>
  );
  return (
    <Dialog
      open
      onClose={onCancel}
      aria-labelledby={`${titleId} ${destinationId}`}
      aria-describedby={summaryId}
      fullWidth
      fullScreen={compact}
      maxWidth="sm"
    >
      {compact ?
        <DialogHeader
          id={titleId}
          title={text.compactTitle}
          onClose={onCancel}
          closeLabel={t.cancel}
        />
      : <DialogTitle id={titleId}>{text.title}</DialogTitle>}
      <Box sx={{ flexShrink: 0, px: { xxs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 24px minmax(0, 1fr)",
            gap: 1,
            alignItems: "start",
            mt: { xxs: 1, sm: 0 },
            mb: 0.5,
          }}
        >
          <Box
            role="group"
            aria-label={text.from(from)}
            sx={{
              gridColumn: 1,
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            <TransferEndpoint
              value={from}
              label={text.fromLabel}
              generation={fromGeneration}
              format={fromFormat}
            />
          </Box>
          <Box
            aria-hidden="true"
            sx={{
              gridColumn: 2,
              display: "flex",
              alignSelf: "center",
              color: "text.secondary",
            }}
          >
            <ArrowForwardIcon />
          </Box>
          <Box
            id={destinationId}
            aria-label={where}
            sx={{
              gridColumn: 3,
              textAlign: "right",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            <TransferEndpoint
              value={where}
              label={text.toLabel}
              games={games}
              generation={toGeneration}
              format={toFormat}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xxs: `minmax(0, ${fromLogos.length}fr) 1px minmax(0, ${toLogos.length}fr)`,
              xs: "minmax(0, 1fr) 24px minmax(0, 1fr)",
            },
            gap: 1,
            mb: 1,
            alignItems: { xxs: "center", xs: "start" },
            "& > span": {
              minWidth: 0,
              flexWrap: { xxs: "nowrap", xs: "wrap" },
            },
            "& img": {
              minWidth: 0,
              flex: { xxs: "1 1 0", xs: "0 1 auto" },
            },
          }}
        >
          <GameLogos logos={fromLogos} />
          <Divider
            orientation="vertical"
            flexItem
            aria-hidden="true"
            sx={{ justifySelf: "center", mt: 0.5 }}
          />
          <GameLogos logos={toLogos} end />
        </Box>
      </Box>
      <ScrollContent>
        <Typography id={summaryId} variant="body2" sx={{ mt: 2 }}>
          {summary}
        </Typography>
        {unavailable.size > 0 && (
          <Box role="group" aria-label={unavailableHeading}>
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "text.primary", fontWeight: 500 }}
            >
              {unavailableHeading}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 2,
                rowGap: 0.5,
                mt: 1,
              }}
            >
              {losses
                .filter(loss => loss.field === "pokemon" && !loss.replacement)
                .map(loss => (
                  <Box
                    key={loss.index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      maxWidth: "100%",
                    }}
                  >
                    <Box
                      role="img"
                      aria-label={names.pokemon(loss.pokemon)}
                      sx={{
                        display: "flex",
                        flexShrink: 0,
                        opacity: 0.5,
                        filter: "grayscale(1)",
                      }}
                    >
                      <PokemonIcon
                        pokemonProperty="name"
                        value={loss.pokemon}
                      />
                    </Box>
                    <Typography
                      component="del"
                      variant="body2"
                      sx={{ overflowWrap: "anywhere", color: "text.secondary" }}
                    >
                      {names.pokemon(loss.pokemon)}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        )}
        {slots.length > 0 &&
          (universalMessages.length > 0 || individualSlots.length > 0) && (
            <Box role="group" aria-label={adjustedHeading}>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.primary", fontWeight: 500 }}
              >
                {adjustedHeading}
              </Typography>
              {hasCarryover && universalMessages.length > 0 && (
                <>
                  <Typography
                    id={universalId}
                    component="h3"
                    variant="subtitle2"
                    sx={{ mt: 1.5, color: "text.secondary" }}
                  >
                    {text.universalChanges}
                  </Typography>
                  <Box
                    component="ul"
                    aria-labelledby={universalId}
                    sx={{ mt: 0, mb: 1, pl: 2.5, color: "text.secondary" }}
                  >
                    {universalMessages.map((message, i) => (
                      <Typography
                        component="li"
                        key={i}
                        variant="body2"
                        sx={{ mt: 0.5 }}
                      >
                        {message}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    individualSlots.length === 1 ?
                      "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                  columnGap: 2,
                  rowGap: 1.5,
                  mt: 1,
                  position: "relative",
                  "&::after":
                    individualSlots.length > 1 ?
                      {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        borderLeft: 1,
                        borderColor: "divider",
                        pointerEvents: "none",
                      }
                    : undefined,
                }}
              >
                {individualSlots.map((index, position) => {
                  const entries = removals.filter(loss => loss.index === index);
                  const changes = adjustments.filter(
                    loss => loss.index === index,
                  );
                  const first = entries[0] ?? changes[0];
                  if (!first) return null;
                  const details = entries.filter(isDetail).map(valueName);
                  const lost = entries.filter(
                    loss => loss.field === "item" || loss.field === "move",
                  );
                  const abilities = entries
                    .filter(loss => loss.field === "ability")
                    .map(valueName);
                  return (
                    <Fragment key={first.index}>
                      {position > 0 && position % 2 === 0 && (
                        <Divider
                          aria-hidden="true"
                          sx={{ gridColumn: "1 / -1" }}
                        />
                      )}
                      <Box
                        role="group"
                        aria-label={names.pokemon(first.pokemon)}
                        sx={{ minWidth: 0, overflowWrap: "anywhere" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            aria-hidden="true"
                            sx={{ display: "flex", flexShrink: 0 }}
                          >
                            <PokemonIcon
                              pokemonProperty="name"
                              value={first.pokemon}
                            />
                          </Box>
                          {pokemonHeading(first)}
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          {lost.length > 0 && (
                            <RemovedEntries
                              losses={lost}
                              generation={fromGeneration}
                              format={fromFormat}
                            />
                          )}
                          {abilities.length > 0 && (
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mb: 0.5 }}
                            >
                              {text.entryLabel(
                                text.removed.ability,
                                list.format(abilities),
                              )}
                            </Typography>
                          )}
                          {details.length > 0 && (
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mb: 0.5 }}
                            >
                              {text.entryLabel(
                                text.removed.details,
                                list.format(details),
                              )}
                            </Typography>
                          )}
                          {changes.map((change, i) => (
                            <AdjustmentDetails
                              key={i}
                              change={change}
                              destination={destination}
                              label={valueName(change)}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Fragment>
                  );
                })}
              </Box>
            </Box>
          )}
      </ScrollContent>
      <Box component="footer" sx={{ flexShrink: 0 }}>
        <DialogContentText
          variant="caption"
          component="p"
          sx={{ my: 1, px: { xxs: 2, sm: 3 }, textAlign: "center" }}
        >
          {hasCarryover ? text.carriedOver : text.emptyTeamHint}
        </DialogContentText>
        <DialogActions
          disableSpacing
          sx={{
            flexDirection: { xxs: "column", sm: "row" },
            alignItems: { xxs: "stretch", sm: "center" },
            flexWrap: "wrap",
            gap: 1,
            p: 2,
            pt: 1,
          }}
        >
          {!compact && <Button onClick={onCancel}>{t.cancel}</Button>}
          <Button onClick={onModify} variant="outlined">
            {hasCarryover ? text.modify : text.clearExisting}
          </Button>
          <Button onClick={onNew} variant="contained">
            {hasCarryover ? text.copy : text.createEmpty}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
