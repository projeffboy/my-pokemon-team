import {
  Suspense,
  useId,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "@/app/shared/TranslationContext";

// A footer button that opens a dialog with the given content and a Go Back action.
// The content is a lazy component, so its code loads the first time the dialog opens.
export default function FooterDialog({
  button,
  title,
  content: Content,
}: {
  button: ReactNode;
  title: string;
  content: ComponentType;
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(open => !open);

  return (
    <>
      <Button variant="footer" onClick={toggle}>
        {button}
      </Button>
      <Dialog
        open={isOpen}
        onClose={toggle}
        aria-labelledby={titleId}
        sx={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id={titleId}>{title}</DialogTitle>
        <DialogContent>
          <Suspense>
            <Content />
          </Suspense>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle}>{t.goBack}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
