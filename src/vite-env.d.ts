/// <reference types="vite/client" />

declare const __LATEST_COMMIT_DATE__: string;

// Set by the Playwire bootstrap that vite.config.ts injects into production builds
interface Window {
  ramp?: {
    que: (() => void)[];
    passiveMode?: boolean;
    spaNewPage?: (path: string) => void;
  };
}
