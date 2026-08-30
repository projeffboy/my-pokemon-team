import { observer } from "mobx-react";
import { useBreakpoint } from "../../../WidthContext";
import SmTeamViewer from "./team-viewer/SmTeamViewer";
import XsTeamViewer from "./team-viewer/XsTeamViewer";

// This component can only be viewed below md breakpoint
const TeamViewer = observer(function TeamViewer() {
  const width = useBreakpoint();

  return width === "xs" ? <XsTeamViewer /> : <SmTeamViewer />;
});

export default TeamViewer;
