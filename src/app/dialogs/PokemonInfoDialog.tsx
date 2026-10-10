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
import { STAT_KEYS } from "@/types";
import { typesIn } from "@/shared/generation-data";
import {
  pokemonAbilities,
  pokemonBaseStats,
  pokemonTypes,
} from "@/shared/pokedex";
import {
  bulbapediaUrl,
  serebiiDexUrl,
  showdownDexUrl,
  smogonDexUrl,
} from "@/shared/dex-urls";
import { introducedIn } from "@/store/filtering";
import { defenceMultiplier } from "@/store/matrix";
import PokemonSprite from "@/app/shared/PokemonSprite";
import dexLogos from "@/images/dex-logos";
import typeIcons from "@/images/type-icons";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import { useTranslation } from "@/app/shared/TranslationContext";
import StatIcon from "./pokemon-info-dialog/StatIcon";

const MAX_BASE_STAT = 255;

// A slot's species: types, abilities, base stats, and weaknesses with its ability and item
const PokemonInfoDialog = observer(function PokemonInfoDialog() {
  const { t, names } = useTranslation();
  const titleId = useId();
  const { dialog } = store;
  const teamIndex = dialog?.teamIndex ?? 0;
  const member = store.analysisTeam[teamIndex];
  const pokemon = member?.name ?? "";
  const { generation, format } = store.currentTeam;
  const entry = pokedex[pokemon];
  const stats = pokemonBaseStats(pokemon, generation, format);
  const statKeys = STAT_KEYS.filter(stat => generation !== 1 || stat !== "spd");
  const statName = (stat: (typeof STAT_KEYS)[number]) =>
    generation === 1 && stat === "spa" ? t.info.special : t.statFullNames[stat];
  const total = statKeys.reduce((sum, stat) => sum + (stats?.[stat] ?? 0), 0);
  const isOpen = dialog?.name === "info" && !!entry;
  const close = () => store.closeDialog();
  const name = names.pokemon(pokemon);
  const typeChip = (type: keyof typeof TYPE_COLORS, suffix = "") => (
    <Chip
      key={type}
      icon={
        <Box
          component="img"
          src={typeIcons[type]}
          alt=""
          aria-hidden="true"
          sx={{ width: 18, height: 18 }}
        />
      }
      label={`${names.type(type)}${suffix}`}
      size="small"
      sx={{
        bgcolor: TYPE_COLORS[type],
        color: TYPE_TEXT_COLORS[type],
        fontWeight: 500,
      }}
    />
  );
  const weaknesses =
    member ?
      typesIn(generation)
        .map(type => ({
          type,
          multiplier: defenceMultiplier(
            type,
            pokemon,
            member.ability,
            member.item,
            generation,
          ),
        }))
        .filter(({ multiplier }) => multiplier > 1)
    : [];
  const about = [
    `#${entry?.num ?? "?"}`,
    entry?.forme,
    entry && t.generation(introducedIn(entry)),
  ].filter(part => part);

  const baseSpeciesName = entry?.baseSpecies ?? entry?.name ?? pokemon;
  const dexLinks = [
    {
      label: t.info.smogonDex,
      href: smogonDexUrl(generation, baseSpeciesName),
      logo: dexLogos.smogon,
    },
    {
      label: t.info.bulbapedia,
      href: bulbapediaUrl(baseSpeciesName),
      logo: dexLogos.bulbapedia,
    },
    {
      label: t.info.serebii,
      href: serebiiDexUrl(generation, entry?.num ?? 0, baseSpeciesName),
      logo: dexLogos.serebii,
    },
    {
      label: t.info.showdownDex,
      href: showdownDexUrl(pokemon),
      logo: dexLogos.showdown,
    },
  ];

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xxs: 1, xs: 2 },
              }}
            >
              <Box sx={{ width: 96, flexShrink: 0 }}>
                <PokemonSprite teamIndex={teamIndex} forceFullSize />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {pokemonTypes(pokemon, generation).map(type =>
                    typeChip(type),
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: entry.forme ? "normal" : "nowrap",
                  }}
                >
                  {about.join(" · ")}
                </Typography>
              </Box>
            </Box>
            {store.rules.abilities && (
              <Box>
                <Typography variant="overline" component="h3">
                  {t.info.abilities}
                </Typography>
                <Typography>
                  {pokemonAbilities(pokemon, generation)
                    .map(names.ability)
                    .join(", ")}
                </Typography>
              </Box>
            )}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="overline" component="h3">
                  {t.info.baseStats}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t.info.total(total)}
                </Typography>
              </Box>
              {statKeys.map(stat => {
                const value = stats?.[stat] ?? 0;
                return (
                  <Box
                    key={stat}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 0.25,
                    }}
                    aria-label={t.info.statValue(statName(stat), value)}
                  >
                    <StatIcon stat={stat} />
                    <Typography
                      variant="body2"
                      sx={{ width: 56, flexShrink: 0 }}
                    >
                      {statName(stat)}
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
                    typeChip(type, multiplier === 2 ? "" : ` ×${multiplier}`),
                  )
                : <Typography variant="body2">{t.nothing}</Typography>}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {/* The pokemon in the other dexes */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 2,
                rowGap: 0.5,
                mr: "auto",
                ml: 1,
              }}
            >
              {dexLinks.map(({ label, href, logo }) => (
                <Link
                  key={href}
                  href={href}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  {/* The site's logo; the link names the site */}
                  <Box
                    component="img"
                    src={logo}
                    alt=""
                    sx={{ width: 16, height: 16 }}
                  />
                  {label}
                </Link>
              ))}
            </Box>
            <Button onClick={close}>{t.close}</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
});

export default PokemonInfoDialog;
