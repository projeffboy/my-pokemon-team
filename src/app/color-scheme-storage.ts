import type { StorageManager } from "@mui/material/styles";

// A light or dark choice lasts three months after the player's last visit
const THREE_MONTHS_IN_SECONDS = 91 * 24 * 60 * 60;

const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${THREE_MONTHS_IN_SECONDS}; Path=/; SameSite=Lax`;
};

export const cookieStorageManager: StorageManager = ({ key }) => ({
  get(defaultValue) {
    if (typeof document === "undefined") return defaultValue;

    const cookieName = `${encodeURIComponent(key)}=`;
    const cookie = document.cookie
      .split("; ")
      .find(value => value.startsWith(cookieName));
    const storedValue =
      cookie ?
        decodeURIComponent(cookie.slice(cookieName.length))
      : defaultValue;

    if (storedValue !== "light" && storedValue !== "dark") return defaultValue;
    // Each visit restarts the three months of a saved choice
    if (cookie) writeCookie(encodeURIComponent(key), storedValue);
    return storedValue;
  },
  set(value) {
    if (typeof document === "undefined") return;

    const cookieName = encodeURIComponent(key);
    if (value === "system") {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
      return;
    }

    writeCookie(cookieName, value);
  },
  subscribe() {
    return () => {};
  },
});
