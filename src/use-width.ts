import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Breakpoint } from "./types";

/*
 * Replacement for Material UI v3's withWidth() HOC.
 * Returns the current breakpoint key: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export default function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse() as Breakpoint[];
  return (
    keys.reduce(
      (output: Breakpoint | null, key: Breakpoint) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.up(key));
        return !output && matches ? key : output;
      },
      null as Breakpoint | null,
    ) || "xs"
  );
}
