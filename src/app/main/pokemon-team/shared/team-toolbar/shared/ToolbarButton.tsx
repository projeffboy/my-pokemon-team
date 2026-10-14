import type { ReactNode } from "react";
import Button, { type ButtonProps } from "@mui/material/Button";

// One of the team toolbar's columns: an icon above its label. The columns are equal, or
// `basis` wide where the toolbar wraps onto two rows.
export default function ToolbarButton({
  icon,
  basis,
  children,
  ...props
}: ButtonProps & { icon: ReactNode; basis?: string }) {
  return (
    <Button
      {...props}
      sx={{
        flex: `1 1 ${basis ?? 0}`,
        minWidth: 0,
        flexDirection: "column",
        gap: 0.5,
        // Shorter on phones and tablets, where two rows of these may stack
        pt: { xxs: 0.75, md: 1.25 },
        pb: { xxs: 0.5, md: 1 },
        px: 0.25,
        fontSize: 12,
        lineHeight: "16px",
        letterSpacing: 0,
        textTransform: "none",
        // A word longer than the column breaks instead of running into the next button
        overflowWrap: "anywhere",
        "& > svg": { fontSize: 22 },
      }}
    >
      {icon}
      <span>{children}</span>
    </Button>
  );
}
