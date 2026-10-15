import { useId, type Ref } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { visuallyHidden } from "@mui/utils";
import { observer } from "mobx-react-lite";
import type { SavedTeam } from "@/types";
import { variantGeneration } from "@/shared/game-variants";
import {
  CHAMPIONS_FORMAT,
  formatShortName,
  gameFormat,
} from "@/shared/formats";
import { GENERATION_GAMES } from "@/shared/generations";
import { COMBINED_GENERATIONS_PROFILE } from "@/shared/generation-profile";
import PokemonIcon from "@/app/shared/PokemonIcon";
import { useTranslation } from "@/app/shared/TranslationContext";
import questionMark from "@/images/question-mark.png";

// The six slots shrink on narrow phones; the icons' blank edges can overlap.
const iconSlot = {
  flex: "0 1 40px",
  minWidth: 0,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { flexShrink: 0 },
} as const;

const SavedTeamListItem = observer(function SavedTeamListItem({
  team,
  isCurrent,
  menuOpen,
  currentTeamRef,
  onOpen,
  onOptions,
}: {
  team: SavedTeam;
  isCurrent: boolean;
  menuOpen: boolean;
  currentTeamRef?: Ref<HTMLLIElement>;
  onOpen: (teamId: string) => void;
  onOptions: (teamId: string, anchorEl: HTMLElement) => void;
}) {
  const { t, names } = useTranslation();
  const descriptionId = useId();
  const name = team.name || t.team.unnamedTeam;
  const subtitle =
    team.generationProfile === COMBINED_GENERATIONS_PROFILE ?
      t.combinedGenerations.label
    : team.format === CHAMPIONS_FORMAT ? t.championsGeneration
    : variantGeneration(team.format) ?
      t.gameVariants[team.format as keyof typeof t.gameVariants]
    : `${t.generation(team.generation)} (${GENERATION_GAMES[team.generation]})`;
  const members = team.team
    .filter(member => member.name)
    .map(member =>
      member.nickname ?
        `${member.nickname} (${names.pokemon(member.name)})`
      : names.pokemon(member.name),
    );

  return (
    <ListItem
      ref={currentTeamRef}
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label={t.teams.optionsFor(name)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={event => onOptions(team.id, event.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemButton
        selected={isCurrent}
        aria-current={isCurrent}
        aria-label={t.teams.load(name)}
        aria-describedby={descriptionId}
        onClick={() => onOpen(team.id)}
        sx={{
          borderRadius: 1,
          mb: 1,
          border: 1,
          borderColor: isCurrent ? "text.primary" : "divider",
        }}
      >
        <ListItemText
          primary={
            <>
              <Box
                component="span"
                sx={{ flex: "1 1 auto", minWidth: 0, overflowWrap: "anywhere" }}
              >
                {name}
              </Box>
              <Chip
                label={
                  isCurrent ?
                    t.teams.current
                  : <>
                      {t.teams.open}
                      <ChevronRightIcon />
                    </>
                }
                size="small"
                color="primary"
                variant={isCurrent ? "filled" : "outlined"}
                sx={{
                  flexShrink: 0,
                  height: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  cursor: "inherit",
                  "& .MuiChip-label": { display: "flex", alignItems: "center" },
                  "& svg": { fontSize: 16, mr: -0.75 },
                }}
              />
            </>
          }
          secondary={
            <>
              <Box component="span" id={descriptionId}>
                {subtitle}
                {team.format && !gameFormat(team.format) ?
                  ` · ${formatShortName(team.format)}`
                : ""}
                <Box component="span" sx={visuallyHidden}>
                  {members.length ? `: ${members.join(", ")}` : ""}
                </Box>
              </Box>
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  display: "flex",
                  mt: 0.5,
                  "& > span": iconSlot,
                  "& img": { height: 24 },
                }}
              >
                {team.team.map((member, i) => (
                  <span
                    key={i}
                    title={member.name ? names.pokemon(member.name) : undefined}
                  >
                    {member.name ?
                      <PokemonIcon pokemonProperty="name" value={member.name} />
                    : <img src={questionMark} alt="" />}
                  </span>
                ))}
              </Box>
            </>
          }
          slotProps={{
            primary: {
              sx: {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                columnGap: 1,
                rowGap: 0.5,
              },
            },
            secondary: { component: "div" },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
});

export default SavedTeamListItem;
