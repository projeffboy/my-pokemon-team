import Grid from "@mui/material/Grid";
import { Breakpoint } from "../types";
import Cards from "./cards";

interface MainProps {
  width: Breakpoint;
}

export default function Main({ width }: MainProps) {
  return (
    <Grid component="main" container size={12} spacing={2}>
      <Cards width={width} />
    </Grid>
  );
}