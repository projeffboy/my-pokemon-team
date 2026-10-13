/// <reference types="vite/client" />

// The latest commit's date, as 2026-10-08
declare const __LATEST_COMMIT_DATE__: string;

// Set by the Playwire bootstrap that vite.config.ts injects into production builds
interface Window {
  ramp?: {
    que: (() => void)[];
    passiveMode?: boolean;
    spaNewPage?: (path: string) => void;
  };
}
