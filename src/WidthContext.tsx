import { createContext, useContext, type ReactNode } from "react";
import useWidth, { type WidthInfo } from "./use-width";

const WidthContext = createContext<WidthInfo | undefined>(undefined);

export function WidthProvider({ children }: { children?: ReactNode }) {
  const width = useWidth();

  return (
    <WidthContext.Provider value={width}>{children}</WidthContext.Provider>
  );
}

function useWidthContext() {
  const context = useContext(WidthContext);

  if (context === undefined) {
    throw new Error("useBreakpoint must be used within a WidthProvider");
  }

  return context;
}

export function useBreakpoint() {
  return useWidthContext().breakpoint;
}

// True below the 'md' breakpoint (equivalent to theme.breakpoints.down('md'))
export function useIsMdDown() {
  return useWidthContext().isMdDown;
}

// True below the 'lg' breakpoint (equivalent to theme.breakpoints.down('lg'))
export function useIsLgDown() {
  return useWidthContext().isLgDown;
}

// True below the 'xl' breakpoint (equivalent to theme.breakpoints.down('xl'))
export function useIsXlDown() {
  return useWidthContext().isXlDown;
}
