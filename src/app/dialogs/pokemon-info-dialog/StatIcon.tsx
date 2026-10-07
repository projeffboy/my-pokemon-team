import SvgIcon from "@mui/material/SvgIcon";
import type { StatKey } from "@/types";

const BURST =
  "M12 2 14 8 21 5 17 10 24 12 17 14 21 19 14 16 12 22 10 16 3 19 7 14 0 12 7 10 3 5 10 8Z";
const RINGS =
  "M12 5a12 7 0 1 0 0 14 12 7 0 1 0 0-14Zm0 2a10 5 0 1 1 0 10 10 5 0 1 1 0-10Zm0 1.5a7.5 3.5 0 1 0 0 7 7.5 3.5 0 1 0 0-7Zm0 1.5a5 2 0 1 1 0 4 5 2 0 1 1 0-4Z";

// Recreated from the stat symbols on the Champions training screen.
export default function StatIcon({ stat }: { stat: StatKey }) {
  return (
    <SvgIcon
      aria-hidden="true"
      sx={{ width: 20, height: 20, flexShrink: 0, color: "text.secondary" }}
    >
      {stat === "hp" ?
        <path d="M12 21 3.3 12.3C-3 6 5.5-2 12 5c6.5-7 15 1 8.7 7.3Z" />
      : stat === "atk" ?
        <path d={BURST} />
      : stat === "spa" ?
        <path d={RINGS} fillRule="evenodd" />
      : stat === "spe" ?
        <path d="M14 3H24L18 6H8ZM6 7H16L10 10H0ZM0 11H10L4 14H14L20 17H10ZM12 18H22L24 21H18Z" />
      : <>
          <path
            d="M1 2H23V17L12 23 1 17Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g transform="translate(4 3) scale(.67)">
            <path d={stat === "def" ? BURST : RINGS} fillRule="evenodd" />
          </g>
        </>
      }
    </SvgIcon>
  );
}
