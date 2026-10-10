import { useLayoutEffect } from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  encodeTeamForUrl,
  syncGenerationToUrl,
  importTeamFromUrlParameter,
  generationSettingsFromUrl,
} from "./shared/team-link";

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
      const teamParameter = new URLSearchParams(location.search).get("team");
      if (!learnsetsLoaded && teamParameter) return;
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
        const settings = generationSettingsFromUrl();
        if (
          firstNavigation &&
          store.isTeamEmpty &&
          store.teams.some(team => team.id === store.currentTeamId) &&
          settings
        )
          Object.assign(store.currentTeam, settings);
        else store.openUnsavedTeam(undefined, settings);
      }
    };
    syncFromUrl();
    addEventListener("popstate", syncFromUrl);

    // store -> URL: keeps the URL's `team` parameter canonical for the current team.
    const disposeAutorun = autorun(() => {
      const encoded = encodeTeamForUrl();
      // A link navigated to while learnsets load must keep its original moves.
      if (
        !learnsetsLoaded &&
        (new URLSearchParams(location.search).get("team") !==
          lastSyncedTeamParameter ||
          context() !== lastContext)
      )
        return;
      lastSyncedTeamParameter = encoded || null;

      const url = new URL(location.href);
      if (encoded) url.searchParams.set("team", encoded);
      else url.searchParams.delete("team");
      syncGenerationToUrl(url, store.currentTeam);
      history.replaceState(history.state, "", url);
      lastContext = context();
    });

    return () => {
      removeEventListener("popstate", syncFromUrl);
      disposeAutorun();
    };
  }, [learnsetsLoaded]);

  return null;
});

export default TeamLinkSync;
