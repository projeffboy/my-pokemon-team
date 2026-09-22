import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  encodeTeamForUrl,
  importTeamFromUrlParameter,
} from "./shared/team-link";

// Keeps the `team` URL parameter and the store's team in sync.
// Not rendered visually; mount once inside the Router.
const TeamLinkSync = observer(function TeamLinkSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastSyncedTeamParameter = useRef<string | null>(null);

  // Parsing a team validates its moves, so nothing syncs until the learnsets have loaded
  const { learnsetsLoaded } = store;

  // URL -> store: runs on initial load and whenever navigation (back/forward, manual
  // address bar edits) changes the `team` parameter to something we didn't just write ourselves.
  useEffect(() => {
    if (!learnsetsLoaded) return;
    const teamParameter = searchParams.get("team");
    if (teamParameter === lastSyncedTeamParameter.current) return;

    lastSyncedTeamParameter.current = teamParameter;
    if (teamParameter) importTeamFromUrlParameter(teamParameter);
  }, [searchParams, learnsetsLoaded]);

  // store -> URL: keeps the URL's `team` parameter canonical for the current team.
  useEffect(() => {
    if (!learnsetsLoaded) return;
    return autorun(() => {
      const encoded = encodeTeamForUrl();
      lastSyncedTeamParameter.current = encoded || null;

      setSearchParams(
        previousParameters => {
          const nextParameters = new URLSearchParams(previousParameters);
          if (encoded) nextParameters.set("team", encoded);
          else nextParameters.delete("team");
          return nextParameters;
        },
        { replace: true },
      );
    });
  }, [setSearchParams, learnsetsLoaded]);

  return null;
});

export default TeamLinkSync;
