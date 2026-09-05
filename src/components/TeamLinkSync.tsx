import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { autorun } from "mobx";
import { encodeTeamForUrl, importTeamFromUrlParam } from "@/team-link";

// Keeps the `team` URL param and the store's team in sync (see /docs/share-link.md).
// Not rendered visually; mount once inside the Router.
export default function TeamLinkSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastSyncedParam = useRef<string | null>(null);

  // URL -> store: runs on initial load and whenever navigation (back/forward, manual
  // address bar edits) changes the `team` param to something we didn't just write ourselves.
  useEffect(() => {
    const param = searchParams.get("team");
    if (param === lastSyncedParam.current) return;

    lastSyncedParam.current = param;
    if (param) importTeamFromUrlParam(param);
  }, [searchParams]);

  // store -> URL: keeps the URL's `team` param canonical for the current team.
  useEffect(() => {
    return autorun(() => {
      const encoded = encodeTeamForUrl();
      lastSyncedParam.current = encoded || null;

      setSearchParams(
        previousParams => {
          const nextParams = new URLSearchParams(previousParams);
          if (encoded) nextParams.set("team", encoded);
          else nextParams.delete("team");
          return nextParams;
        },
        { replace: true },
      );
    });
  }, [setSearchParams]);

  return null;
}
