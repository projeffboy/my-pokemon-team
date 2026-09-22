import { lazy, Suspense, useState } from "react";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TableChart from "@mui/icons-material/TableChart";

// The chart images and their tabs load the first time the dialog opens
const TypeChart = lazy(() => import("./type-chart-dialog/TypeChart"));
import { useBreakpoint } from "./shared/WidthContext";

export default function TypeChartDialog() {
  const width = useBreakpoint();
  const isExtended = width !== "xs" && width !== "sm";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Fab
        onClick={toggleDialog}
        color="primary"
        size={width === "xs" ? "small" : "large"}
        variant={isExtended ? "extended" : "circular"}
        sx={{ position: "fixed", bottom: 116, right: { xs: 16, sm: 24 } }}
        aria-label="Type Chart"
      >
        <TableChart sx={{ mr: isExtended ? 1 : 0 }} />
        {isExtended && "Type Chart"}
      </Fab>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-label="Type Chart"
        maxWidth="md"
        fullWidth
      >
        <Suspense>
          <TypeChart />
        </Suspense>
        <DialogActions>
          <Button onClick={toggleDialog}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
