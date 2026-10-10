import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

// A pair of dice: the whole team is rolled, not one slot
const TeamDiceIcon = ({ sx = [], ...props }: SvgIconProps) => (
  <SvgIcon
    {...props}
    sx={[
      {
        overflow: "visible",
        "& [data-die]": { transformBox: "fill-box", transformOrigin: "center" },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <path
      data-die
      fillRule="evenodd"
      d="M2 1.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5v-8a1.5 1.5 0 0 1 1.5-1.5zM2.1 4.25a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0-2.3 0zM4.85 7a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0-2.3 0zM7.6 9.75a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0-2.3 0z"
    />
    <path
      data-die
      fillRule="evenodd"
      d="M14 11.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5v-8a1.5 1.5 0 0 1 1.5-1.5zM19.6 14.25a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0-2.3 0zM14.1 19.75a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0-2.3 0z"
    />
  </SvgIcon>
);

export default TeamDiceIcon;
