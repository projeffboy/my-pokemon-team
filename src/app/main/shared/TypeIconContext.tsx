import { createContext, useContext, useState, type ReactNode } from "react";

const TypeIconContext = createContext(false);
const SetTypeIconContext = createContext<(hasIcon: boolean) => void>(() => {});

export function TypeIconProvider({ children }: { children: ReactNode }) {
  const [hasIcon, setHasIcon] = useState(false);
  return (
    <SetTypeIconContext.Provider value={setHasIcon}>
      <TypeIconContext.Provider value={hasIcon}>
        {children}
      </TypeIconContext.Provider>
    </SetTypeIconContext.Provider>
  );
}

export const useTypeIcons = () => useContext(TypeIconContext);
export const useSetTypeIcons = () => useContext(SetTypeIconContext);
