import { lazy, Suspense, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "@/app/shared/TranslationContext";

// The chart images and their tabs load the first time the dialog opens
const TypeChart = lazy(() => import("./type-chart-dialog/TypeChart"));

export default function TypeChartDialog() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => setIsDialogOpen(open => !open);

  return (
    <>
      <Button variant="footer" onClick={toggleDialog}>
        {t.footer.typeChart}
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-label={t.footer.typeChart}
        maxWidth="md"
        fullWidth
      >
        <Suspense>
          <TypeChart />
        </Suspense>
        <DialogActions>
          <Button onClick={toggleDialog}>{t.goBack}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
