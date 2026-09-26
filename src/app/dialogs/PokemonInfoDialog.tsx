import { useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import store from "@/store";
import pokedex from "@/data/pokedex";
import { POKEMON_TYPES, STAT_KEYS } from "@/types";
import { pokemonAbilities, pokemonTypes } from "@/shared/pokedex";
import { baseStatTotal } from "@/shared/set-details";
import { smogonDexUrl } from "@/shared/generations";
import { introducedIn } from "@/store/filtering";
import { scoreToMultiplier } from "@/store/matrix";
import { typeAgainstPokemon } from "@/store/shared/effectiveness";
import PokemonSprite from "@/app/main/pokemon-team/shared/PokemonSprite";
import { TYPE_COLORS } from "@/app/main/team-stats/shared/type-colors";
import { useTranslation } from "@/app/shared/TranslationContext";

const MAX_BASE_STAT = 255;

// A slot's species: types, abilities, base stats, and weaknesses with its ability and item
const PokemonInfoDialog = observer(function PokemonInfoDialog() {
  const { t, names } = useTranslation();
  const titleId = useId();
  const { dialog } = store;
  const teamIndex = dialog?.teamIndex ?? 0;
  const member = store.team[teamIndex];
  const pokemon = member?.name ?? "";
  const entry = pokedex[pokemon];
  const isOpen = dialog?.name === "info" && !!entry;
  const close = () => store.closeDialog();
  const name = names.pokemon(pokemon);
  const typeChip = (type: keyof typeof TYPE_COLORS, suffix = "") => (
    <Chip
      key={type}
      label={`${names.type(type)}${suffix}`}
      size="small"
      sx={{
        bgcolor: TYPE_COLORS[type],
        color: "common.white",
        fontWeight: 500,
      }}
    />
  );
  const weaknesses =
    member ?
      POKEMON_TYPES.map(type => ({
        type,
        multiplier: scoreToMultiplier(
          typeAgainstPokemon(type, pokemon, member.ability, member.item),
        ),
      })).filter(({ multiplier }) => multiplier > 1)
    : [];
  const about = [
    `#${entry?.num ?? "?"}`,
    entry?.forme,
    entry && t.generation(introducedIn(entry)),
  ].filter(part => part);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      {isOpen && entry && (
        <>
          <DialogTitle id={titleId}>{name}</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 96, flexShrink: 0 }}>
                <PokemonSprite teamIndex={teamIndex} forceFullSize />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {pokemonTypes(pokemon).map(type => typeChip(type))}
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {about.join(" · ")}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="overline" component="h3">
                {t.info.abilities}
              </Typography>
              <Typography>
                {pokemonAbilities(pokemon).map(names.ability).join(", ")}
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="overline" component="h3">
                  {t.info.baseStats}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t.info.total(baseStatTotal(entry.baseStats))}
                </Typography>
              </Box>
              {STAT_KEYS.map(stat => {
                const value = entry.baseStats?.[stat] ?? 0;
                return (
                  <Box
                    key={stat}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 0.25,
                    }}
                    aria-label={t.info.statValue(t.statFullNames[stat], value)}
                  >
                    <Typography
                      variant="body2"
                      sx={{ width: 56, flexShrink: 0 }}
                    >
                      {t.statFullNames[stat]}
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "action.hover",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(100 * value) / MAX_BASE_STAT}%`,
                          height: "100%",
                          bgcolor:
                            value >= 100 ? "success.main"
                            : value >= 60 ? "warning.main"
                            : "error.main",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ width: 28, textAlign: "right", flexShrink: 0 }}
                    >
                      {value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box>
              <Typography variant="overline" component="h3">
                {t.info.weakTo}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {weaknesses.length ?
                  weaknesses.map(({ type, multiplier }) =>
                    typeChip(type, multiplier > 2 ? ` ×${multiplier}` : ""),
                  )
                : <Typography variant="body2">{t.nothing}</Typography>}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Link
              href={smogonDexUrl(
                store.currentTeam.generation,
                entry.baseSpecies ?? entry.name ?? pokemon,
              )}
              sx={{ mr: "auto", ml: 1 }}
            >
              {t.info.smogonDex}
            </Link>
            <Button onClick={close}>{t.close}</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
});

export default PokemonInfoDialog;
