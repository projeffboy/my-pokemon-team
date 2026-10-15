import { lazy, Suspense, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "@/app/shared/TranslationContext";
import { useIsSmDown } from "@/app/shared/WidthContext";
import ErrorBoundary from "@/app/shared/ErrorBoundary";

// The chart images and their tabs load the first time the dialog opens
const TypeChart = lazy(() => import("./type-chart-dialog/TypeChart"));

export default function TypeChartDialog() {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Button variant="footer" onClick={toggleDialog}>
        {t.footer.typeChart}
      </Button>
      {/* Full screen on phones, so the three tabs fit side by side at 320px */}
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        // It has no title for MUI to name it by
        slotProps={{ paper: { "aria-label": t.footer.typeChart } }}
        maxWidth="md"
        fullWidth
        fullScreen={isSmDown}
      >
        <ErrorBoundary>
          <Suspense>
            <TypeChart />
          </Suspense>
        </ErrorBoundary>
        <DialogActions>
          <Button onClick={toggleDialog}>{t.goBack}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
