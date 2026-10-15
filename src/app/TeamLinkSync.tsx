import { useLayoutEffect, useRef } from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { gameFormat } from "@/shared/formats";
import {
  encodeTeamForUrl,
  syncTeamSettingsToUrl,
  importTeamFromUrlParameter,
  generationSettingsFromUrl,
  battleFormatFromUrl,
} from "./shared/team-link";

// Safari allows 100 history writes per 30 seconds. Edits write at once until a burst of
// them, such as a slider drag, uses up this many writes, which come back two a second.
const URL_WRITE_BURST = 30;
const URL_WRITE_INTERVAL = 500;
const PENDING_URL_KEY = "mypokemonteam-pending-url";

// The team's settings that a link carries beside the team itself
const settingsKey = (params: URLSearchParams) =>
  ["gen", "game", "battle"].map(key => params.get(key) ?? "").join("|");

function restorePendingReload() {
  try {
    const pending: unknown = JSON.parse(
      sessionStorage.getItem(PENDING_URL_KEY) ?? "null",
    );
    sessionStorage.removeItem(PENDING_URL_KEY);
    const navigation = performance.getEntriesByType("navigation")[0];
    if (
      !(navigation instanceof PerformanceNavigationTiming) ||
      navigation.type !== "reload"
    )
      return;
    if (
      !pending ||
      typeof pending !== "object" ||
      !("href" in pending) ||
      pending.href !== location.href ||
      !("url" in pending) ||
      typeof pending.url !== "string"
    )
      return;
    const url = new URL(pending.url);
    if (url.origin !== location.origin || url.pathname !== location.pathname)
      return;
    history.replaceState(history.state, "", url);
    if ("teamId" in pending && typeof pending.teamId === "string")
      store.selectTeam(pending.teamId);
  } catch {
    // Site storage may be blocked; the existing share link remains usable.
  }
}

// Keeps the `team` URL parameter and the store's team in sync.
// Not rendered visually; mount once.
const TeamLinkSync = observer(function TeamLinkSync() {
  const { learnsetsLoaded } = store;
  const restoredReload = useRef(false);
  const pendingNavigation = useRef(false);

  useLayoutEffect(() => {
    // Team text needs learnsets; empty visits must initialize before the first edit.
    if (!learnsetsLoaded && new URLSearchParams(location.search).get("team"))
      return;
    const initializes = !restoredReload.current;
    if (initializes) {
      restoredReload.current = true;
      restorePendingReload();
    }
    let lastSyncedTeamParameter: string | null = null;
    let lastContext = "||";
    let initialNavigation = initializes;
    let pendingWrite: ReturnType<typeof setTimeout> | undefined;
    const context = () => settingsKey(new URLSearchParams(location.search));

    // URL -> store: runs on initial load and whenever navigation (back/forward) changes
    // the `team` parameter to something we didn't just write ourselves.
    const syncFromUrl = () => {
      clearTimeout(pendingWrite);
      pendingWrite = undefined;
      const teamParameter = new URLSearchParams(location.search).get("team");
      if (!learnsetsLoaded && teamParameter) {
        pendingNavigation.current = true;
        return;
      }
      pendingNavigation.current = false;
      const firstNavigation = initialNavigation;
      initialNavigation = false;
      if (
        !firstNavigation &&
        teamParameter === lastSyncedTeamParameter &&
        context() === lastContext
      )
        return;
      lastContext = context();

      lastSyncedTeamParameter = teamParameter;
      if (teamParameter) importTeamFromUrlParameter(teamParameter);
      else {
        const generationSettings = generationSettingsFromUrl();
        const settings = generationSettings && {
          ...generationSettings,
          battleFormat: battleFormatFromUrl(),
        };
        if (
          firstNavigation &&
          store.isTeamEmpty &&
          store.teams.some(team => team.id === store.currentTeamId) &&
          settings
        ) {
          // The URL carries no tier, so the same game keeps the team's
          const { generation, format, generationProfile, battleFormat } =
            store.currentTeam;
          if (
            generation !== settings.generation ||
            gameFormat(format) !== settings.format ||
            generationProfile !== settings.generationProfile ||
            battleFormat !== settings.battleFormat
          )
            Object.assign(store.currentTeam, {
              ...settings,
              generationProfile: settings.generationProfile,
            });
        } else store.openUnsavedTeam(undefined, settings);
      }
    };
    if (initializes || pendingNavigation.current) syncFromUrl();
    addEventListener("popstate", syncFromUrl);

    // store -> URL: keeps the URL's `team` parameter canonical for the current team.
    let writesLeft = URL_WRITE_BURST;
    let lastRefill = Date.now();
    let desiredUrl = location.href;
    const rememberPending = () => {
      try {
        if (desiredUrl === location.href)
          sessionStorage.removeItem(PENDING_URL_KEY);
        else
          sessionStorage.setItem(
            PENDING_URL_KEY,
            JSON.stringify({
              href: location.href,
              url: desiredUrl,
              teamId: store.currentTeamId,
            }),
          );
      } catch {
        // The URL still updates normally when site storage is blocked.
      }
    };
    const writeUrl = () => {
      pendingWrite = undefined;
      try {
        history.replaceState(history.state, "", desiredUrl);
      } catch {
        // Keep the pending marker if the browser refused a history write.
      }
      rememberPending();
    };
    const disposeAutorun = autorun(() => {
      const encoded = encodeTeamForUrl();
      if (pendingNavigation.current) return;

      const url = new URL(location.href);
      if (encoded) url.searchParams.set("team", encoded);
      else url.searchParams.delete("team");
      syncTeamSettingsToUrl(url, store.currentTeam);
      desiredUrl = url.href;
      lastSyncedTeamParameter = encoded || null;
      lastContext = settingsKey(url.searchParams);
      rememberPending();
      if (desiredUrl === location.href) return;
      const now = Date.now();
      const refill = Math.floor((now - lastRefill) / URL_WRITE_INTERVAL);
      writesLeft = Math.min(URL_WRITE_BURST, writesLeft + refill);
      if (refill) lastRefill += refill * URL_WRITE_INTERVAL;
      if (writesLeft > 0) {
        clearTimeout(pendingWrite);
        writesLeft--;
        writeUrl();
      } else if (!pendingWrite)
        pendingWrite = setTimeout(() => {
          lastRefill = Date.now();
          writeUrl();
        }, URL_WRITE_INTERVAL);
    });

    return () => {
      removeEventListener("popstate", syncFromUrl);
      clearTimeout(pendingWrite);
      disposeAutorun();
    };
  }, [learnsetsLoaded]);

  return null;
});

export default TeamLinkSync;
