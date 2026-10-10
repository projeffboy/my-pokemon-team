import type { MouseEvent, ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// An outlined header button: an icon above a short caption
export default function CaptionButton({
  icon,
  caption,
  label,
  onClick,
  ...aria
}: {
  icon: ReactNode;
  caption: string;
  label: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
}) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      aria-label={label}
      {...aria}
      sx={{
        minWidth: 48,
        px: 0.5,
        py: 0,
        flexShrink: 0,
        flexDirection: "column",
        gap: "1px",
        "& > svg": { fontSize: 20 },
      }}
    >
      {icon}
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          fontSize: 12,
          lineHeight: 1,
          letterSpacing: 0,
          textTransform: "none",
          whiteSpace: "nowrap",
        }}
      >
        {caption}
      </Box>
    </Button>
  );
}
