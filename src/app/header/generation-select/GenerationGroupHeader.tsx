import ListSubheader from "@mui/material/ListSubheader";

// Select gives each child an option's role and handlers, which a heading must not take
export default function GenerationGroupHeader({
  title,
  first,
}: {
  title: string;
  first: boolean;
}) {
  return (
    <ListSubheader
      role="presentation"
      sx={{
        // The menu's elevation tint, so the sticky heading matches the menu behind it
        backgroundImage: "var(--Paper-overlay)",
        ...(!first && { borderTop: 1, borderColor: "divider", mt: 1 }),
      }}
    >
      {title}
    </ListSubheader>
  );
}
