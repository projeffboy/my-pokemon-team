import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "../TranslationContext";
import PokemonIcon from "../PokemonIcon";
import type { TransferLoss } from "@/store/generation-transfer";
import { isPokemonType, type Generation } from "@/types";
import { moveTypeIn } from "@/shared/generation-data";
import typeIcons from "@/images/type-icons";

export default function RemovedEntries({
  losses,
  generation,
  format,
}: {
  losses: TransferLoss[];
  generation: Generation;
  format: string;
}) {
  const { t, names } = useTranslation();
  const text = t.generationTransfer;
  return (
    <Box
      component="ul"
      sx={{ mt: 0, mb: 0.5, p: 0, listStyle: "none", color: "error.main" }}
    >
      {losses.map((loss, i) => {
        const value = loss.value ?? "";
        const isItem = loss.field === "item";
        const name = isItem ? names.item(value) : names.move(value);
        const type = isItem ? undefined : moveTypeIn(value, generation, format);
        return (
          <Box
            component="li"
            key={i}
            sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}
          >
            <Box component="span" sx={visuallyHidden}>
              {text.entryLabel(
                isItem ? text.removed.item : text.removed.move,
                "",
              )}
            </Box>
            <RemoveIcon sx={{ fontSize: 16, mt: 0.25, flexShrink: 0 }} />
            {isItem ?
              <Box
                role="img"
                aria-label={t.team.itemIcon(name)}
                sx={{ display: "flex", flexShrink: 0 }}
              >
                <PokemonIcon pokemonProperty="item" value={value} />
              </Box>
            : type &&
              isPokemonType(type) && (
                <Box
                  component="img"
                  data-move-type={type}
                  src={typeIcons[type]}
                  alt={names.type(type)}
                  sx={{ width: 16, height: 16, mt: 0.25, flexShrink: 0 }}
                />
              )
            }
            <Typography variant="body2">{name}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
