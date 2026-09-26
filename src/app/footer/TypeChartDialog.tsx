import { lazy, Suspense, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

// The chart images and their tabs load the first time the dialog opens
const TypeChart = lazy(() => import("./type-chart-dialog/TypeChart"));

export default function TypeChartDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Button variant="footer" onClick={toggleDialog}>
        Type Chart
      </Button>
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
