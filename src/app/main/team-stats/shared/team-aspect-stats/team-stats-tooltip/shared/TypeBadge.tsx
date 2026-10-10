import Box from "@mui/material/Box";
import { useTranslation } from "@/app/shared/TranslationContext";
import { TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import typeIcons from "@/images/type-icons";
import type { PokemonType } from "@/types";

export default function TypeBadge({
  type,
  typeColor,
  hasIcon,
}: {
  type: PokemonType;
  typeColor: string;
  hasIcon: boolean;
}) {
  const { names } = useTranslation();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        gap: 0.375,
        bgcolor: typeColor,
        color: TYPE_TEXT_COLORS[type],
        px: 0.5,
        borderRadius: 0.5,
      }}
    >
      {hasIcon && (
        <Box
          component="img"
          src={typeIcons[type]}
          alt=""
          sx={{ width: 14, height: 14, flexShrink: 0 }}
        />
      )}
      {names.type(type)}
    </Box>
  );
}
