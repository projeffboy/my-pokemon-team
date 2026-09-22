import { useEffect } from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  encodeTeamForUrl,
  importTeamFromUrlParameter,
} from "./shared/team-link";

// Keeps the `team` URL parameter and the store's team in sync.
// Not rendered visually; mount once.
const TeamLinkSync = observer(function TeamLinkSync() {
  // Parsing a team validates its moves, so nothing syncs until the learnsets have loaded
  const { learnsetsLoaded } = store;

  useEffect(() => {
    if (!learnsetsLoaded) return;
    let lastSyncedTeamParameter: string | null = null;

    // URL -> store: runs on initial load and whenever navigation (back/forward) changes
    // the `team` parameter to something we didn't just write ourselves.
    const syncFromUrl = () => {
      const teamParameter = new URLSearchParams(location.search).get("team");
      if (teamParameter === lastSyncedTeamParameter) return;

      lastSyncedTeamParameter = teamParameter;
      if (teamParameter) importTeamFromUrlParameter(teamParameter);
    };
    syncFromUrl();
    addEventListener("popstate", syncFromUrl);

    // store -> URL: keeps the URL's `team` parameter canonical for the current team.
    const disposeAutorun = autorun(() => {
      const encoded = encodeTeamForUrl();
      lastSyncedTeamParameter = encoded || null;

      const url = new URL(location.href);
      if (encoded) url.searchParams.set("team", encoded);
      else url.searchParams.delete("team");
      history.replaceState(history.state, "", url);
    });

    return () => {
      removeEventListener("popstate", syncFromUrl);
      disposeAutorun();
    };
  }, [learnsetsLoaded]);

  return null;
});

export default TeamLinkSync;
