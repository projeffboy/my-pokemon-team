import { useId, useState, type ReactNode } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FooterButton from "./FooterButton";

// A footer button that opens a dialog with the given content and a Go Back action
export default function FooterDialog({
  button,
  title,
  children,
}: {
  button: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(open => !open);

  return (
    <>
      <FooterButton onClick={toggle}>{button}</FooterButton>
      <Dialog
        open={isOpen}
        onClose={toggle}
        aria-labelledby={titleId}
        sx={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id={titleId}>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={toggle}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
