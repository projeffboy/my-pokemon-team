import { createContext, useContext, type PropsWithChildren } from "react";
import { Breakpoint } from "./types";
import useWidth from "./use-width";

const WidthContext = createContext<Breakpoint | undefined>(undefined);

export function WidthProvider({ children }: PropsWithChildren) {
  const width = useWidth();

  return (
    <WidthContext.Provider value={width}>{children}</WidthContext.Provider>
  );
}

export function useBreakpoint() {
  const width = useContext(WidthContext);

  if (width === undefined) {
    throw new Error("useBreakpoint must be used within a WidthProvider");
  }

  return width;
}