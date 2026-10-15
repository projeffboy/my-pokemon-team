import Box from "@mui/material/Box";
import type { PokemonType } from "@/types";
import typeIcons from "@/images/type-icons";

const ICON_WIDTH = 14;
const ICON_GAP = 3;
const LABEL_PADDING = 8;

export default function TypeLabel({
  type,
  name,
  abbreviation,
  hasIcon,
  showFullName,
  iconAbove = false,
}: {
  type: PokemonType;
  name: string;
  abbreviation: string;
  hasIcon: boolean;
  showFullName: boolean;
  // Where the icon does not fit beside the text, show it above instead of leaving it out
  iconAbove?: boolean;
}) {
  const stacked = iconAbove && !hasIcon;
  return (
    <Box
      component="span"
      data-type-label
      sx={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        // The layout hook reads the column gap, so it stays whichever way the label runs
        columnGap: ICON_GAP / 8,
        px: LABEL_PADDING / 16,
        pt: stacked ? 0.375 : 0,
      }}
      data-icon-above={stacked ? "" : undefined}
    >
      {(hasIcon || stacked) && (
        <Box
          component="img"
          src={typeIcons[type]}
          alt=""
          sx={{ width: ICON_WIDTH, height: ICON_WIDTH, flexShrink: 0 }}
        />
      )}
      {[
        { key: "name", text: name, visible: showFullName },
        { key: "abbreviation", text: abbreviation, visible: !showFullName },
      ].map(({ key, text, visible }) => (
        <Box
          key={key}
          component="span"
          data-type-name={key === "name" ? "" : undefined}
          data-type-abbreviation={key === "abbreviation" ? "" : undefined}
          aria-hidden="true"
          sx={{
            whiteSpace: "nowrap",
            width: "max-content",
            flexShrink: 0,
            position: visible ? "static" : "absolute",
            // Inherited, so a hidden ancestor hides it too
            visibility: visible ? "inherit" : "hidden",
          }}
        >
          {text}
        </Box>
      ))}
    </Box>
  );
}
