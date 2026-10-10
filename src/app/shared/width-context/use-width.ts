import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Breakpoint } from "@/types";

export interface WidthInfo {
  breakpoint: Breakpoint;
  isSmDown: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
}

/*
 * Replacement for Material UI v3's withWidth() HOC.
 * Returns the current breakpoint key ('xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl')
 * along with useMediaQuery(theme.breakpoints.down(...)) shorthand booleans.
 */
export default function useWidth(): WidthInfo {
  const theme = useTheme();

  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
  const isXlDown = useMediaQuery(theme.breakpoints.down("xl"));

  const breakpoint: Breakpoint =
    isXsDown ? "xxs"
    : isSmDown ? "xs"
    : isMdDown ? "sm"
    : isLgDown ? "md"
    : isXlDown ? "lg"
    : "xl";

  return { breakpoint, isSmDown, isMdDown, isLgDown };
}
