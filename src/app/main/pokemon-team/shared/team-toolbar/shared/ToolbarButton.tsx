import type { ReactNode } from "react";
import Button, { type ButtonProps } from "@mui/material/Button";

// One of the team toolbar's equal columns: an icon above its label
export default function ToolbarButton({
  icon,
  children,
  ...props
}: ButtonProps & { icon: ReactNode }) {
  return (
    <Button
      {...props}
      sx={{
        flex: "1 1 0",
        minWidth: 0,
        flexDirection: "column",
        gap: 0.5,
        pt: 1.25,
        pb: 1,
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
