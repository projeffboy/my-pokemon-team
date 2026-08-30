import type { StorageManager } from "@mui/material/styles";

const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

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

    return storedValue === "light" || storedValue === "dark" ?
        storedValue
      : defaultValue;
  },
  set(value) {
    if (typeof document === "undefined") return;

    const cookieName = encodeURIComponent(key);
    if (value === "system") {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
      return;
    }

    document.cookie = `${cookieName}=${encodeURIComponent(value)}; Max-Age=${ONE_WEEK_IN_SECONDS}; Path=/; SameSite=Lax`;
  },
  subscribe() {
    return () => {};
  },
});
