import { createContext, useContext, type ReactNode } from "react";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { english, type Translation } from "@/i18n/translation";

const TranslationContext = createContext<Translation>(english);

// Hands the store's current language to every component, observer or not
export const TranslationProvider = observer(function TranslationProvider({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <TranslationContext.Provider value={store.translation}>
      {children}
    </TranslationContext.Provider>
  );
});

// The current language's UI text (`t`) and data names (`names`)
export const useTranslation = () => useContext(TranslationContext);
