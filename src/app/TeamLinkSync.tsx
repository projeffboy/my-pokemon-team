import { useLayoutEffect } from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { gameFormat } from "@/shared/formats";
import {
  encodeTeamForUrl,
  syncGenerationToUrl,
  importTeamFromUrlParameter,
  generationSettingsFromUrl,
} from "./shared/team-link";

// Safari allows 100 history writes per 30 seconds. Edits write at once until a burst of
// them, such as a slider drag, uses up this many writes, which come back two a second.
const URL_WRITE_BURST = 30;
const URL_WRITE_INTERVAL = 500;

// Keeps the `team` URL parameter and the store's team in sync.
// Not rendered visually; mount once.
const TeamLinkSync = observer(function TeamLinkSync() {
  const { learnsetsLoaded } = store;

  useLayoutEffect(() => {
    // Team text needs learnsets; empty visits must initialize before the first edit.
    if (!learnsetsLoaded && new URLSearchParams(location.search).get("team"))
      return;
    let lastSyncedTeamParameter: string | null = null;
    let lastContext = "|";
    let initialNavigation = true;
    const context = () => {
      const params = new URLSearchParams(location.search);
      return `${params.get("gen") ?? ""}|${params.get("game") ?? ""}`;
    };

    // URL -> store: runs on initial load and whenever navigation (back/forward) changes
    // the `team` parameter to something we didn't just write ourselves.
    const syncFromUrl = () => {
      const firstNavigation = initialNavigation;
      initialNavigation = false;
      const teamParameter = new URLSearchParams(location.search).get("team");
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
        const settings = generationSettingsFromUrl();
        if (
          firstNavigation &&
          store.isTeamEmpty &&
          store.teams.some(team => team.id === store.currentTeamId) &&
          settings
        ) {
          // The URL carries no tier, so the same game keeps the team's
          const { generation, format } = store.currentTeam;
          if (
            generation !== settings.generation ||
            gameFormat(format) !== settings.format
          )
            Object.assign(store.currentTeam, settings);
        } else store.openUnsavedTeam(undefined, settings);
      }
    };
    syncFromUrl();
    addEventListener("popstate", syncFromUrl);

    // store -> URL: keeps the URL's `team` parameter canonical for the current team.
    let writesLeft = URL_WRITE_BURST;
    let lastRefill = Date.now();
    let pendingWrite: ReturnType<typeof setTimeout> | undefined;
    const disposeAutorun = autorun(
      () => {
        const encoded = encodeTeamForUrl();
        lastSyncedTeamParameter = encoded || null;

        const url = new URL(location.href);
        if (encoded) url.searchParams.set("team", encoded);
        else url.searchParams.delete("team");
        syncGenerationToUrl(url, store.currentTeam);
        try {
          history.replaceState(history.state, "", url);
        } catch {
          // The browser's limit on history writes; the next edit writes again
        }
        lastContext = context();
      },
      {
        scheduler: run => {
          const now = Date.now();
          const refill = Math.floor((now - lastRefill) / URL_WRITE_INTERVAL);
          writesLeft = Math.min(URL_WRITE_BURST, writesLeft + refill);
          if (refill) lastRefill = now;
          if (writesLeft > 0) {
            writesLeft--;
            run();
          } else
            pendingWrite = setTimeout(() => {
              // This write is the one that came back in the meantime
              lastRefill = Date.now();
              run();
            }, URL_WRITE_INTERVAL);
        },
      },
    );

    return () => {
      removeEventListener("popstate", syncFromUrl);
      clearTimeout(pendingWrite);
      disposeAutorun();
    };
  }, [learnsetsLoaded]);

  return null;
});

export default TeamLinkSync;
