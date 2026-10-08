import { useId, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SendIcon from "@mui/icons-material/Send";
import { observer } from "mobx-react-lite";
import store from "@/store";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import CaptionButton from "./shared/CaptionButton";
import {
  capturePage,
  describeScreen,
  MAX_IMAGES_LENGTH,
} from "./feedback-dialog/capture-page";
import { compressImage } from "./feedback-dialog/compress-image";

const EMAIL = "jeffery124@gmail.com";
const MAX_UPLOADS = 3;
// Leaves room in MAX_IMAGES_LENGTH for the page screenshot
const MAX_UPLOADS_LENGTH = 3_000_000;

type Upload = { id: number; name: string; dataUrl: string };
let nextUploadId = 0;
const totalLength = (uploads: Upload[]) =>
  uploads.reduce((total, upload) => total + upload.dataUrl.length, 0);

// Posts the feedback to the api/feedback.ts function, which emails it along with the
// screen size, any images the visitor adds, and, if they agree, the page link and a screenshot
const FeedbackDialog = observer(function FeedbackDialog() {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [attachLink, setAttachLink] = useState(true);
  const [attachScreenshot, setAttachScreenshot] = useState(true);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const uploadsRef = useRef<Upload[]>([]);
  const [pendingUploads, setPendingUploads] = useState(0);
  const sendVersion = useRef(0);
  const [uploadError, setUploadError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const close = () => {
    sendVersion.current += 1;
    setIsOpen(false);
    setStatus("idle");
  };
  const updateUploads = (next: Upload[]) => {
    uploadsRef.current = next;
    setUploads(next);
  };

  const addUploads = async (input: HTMLInputElement) => {
    const files = Array.from(input.files ?? []);
    // Lets the same file be picked again after it is removed
    input.value = "";
    let error: string | undefined;
    setPendingUploads(count => count + 1);
    try {
      for (const file of files) {
        if (uploadsRef.current.length >= MAX_UPLOADS) break;
        const dataUrl = await compressImage(file).catch(() => undefined);
        const current = uploadsRef.current;
        if (!dataUrl) {
          error = t.feedback.imageUnreadable;
        } else if (current.length >= MAX_UPLOADS) {
          break;
        } else if (totalLength(current) + dataUrl.length > MAX_UPLOADS_LENGTH) {
          error = t.feedback.imagesTooLarge;
        } else {
          updateUploads([
            ...current,
            { id: nextUploadId++, name: file.name, dataUrl },
          ]);
        }
      }
      setUploadError(error);
    } finally {
      setPendingUploads(count => count - 1);
    }
  };

  const send = async () => {
    const version = ++sendVersion.current;
    setStatus("sending");
    const screenshot =
      attachScreenshot &&
      (await capturePage(
        dialogRef.current,
        MAX_IMAGES_LENGTH - totalLength(uploads),
      ));
    if (version !== sendVersion.current) return;
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        screen: describeScreen(),
        ...(email.trim() && { email }),
        ...(attachLink && { link: location.href }),
        ...(screenshot && { screenshot }),
        ...(uploads.length > 0 && {
          images: uploads.map(upload => upload.dataUrl),
        }),
      }),
    }).catch(() => undefined);
    if (version !== sendVersion.current) return;
    if (!response?.ok) {
      setStatus("failed");
      return;
    }
    setMessage("");
    updateUploads([]);
    setUploadError(undefined);
    close();
    store.openSnackbar(t.feedback.sent, false, "send");
  };

  return (
    <>
      <CaptionButton
        icon={<FeedbackIcon />}
        caption={t.feedback.caption}
        label={t.feedback.button}
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        ref={dialogRef}
        open={isOpen}
        onClose={close}
        aria-labelledby={titleId}
        fullWidth
      >
        <DialogTitle id={titleId}>{t.feedback.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t.feedback.description}
          </DialogContentText>
          <TextField
            autoFocus
            label={t.feedback.label}
            placeholder={t.feedback.placeholder}
            multiline
            minRows={4}
            fullWidth
            value={message}
            disabled={status === "sending"}
            onChange={event => setMessage(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 5000 } }}
          />
          <TextField
            label={t.feedback.email}
            helperText={t.feedback.emailHelper}
            type="email"
            fullWidth
            sx={{ mt: 2 }}
            value={email}
            disabled={status === "sending"}
            onChange={event => setEmail(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 254 } }}
          />
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={attachLink}
                disabled={status === "sending"}
                onChange={event => setAttachLink(event.target.checked)}
              />
            }
            label={t.feedback.attachLink}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={attachScreenshot}
                disabled={status === "sending"}
                onChange={event => setAttachScreenshot(event.target.checked)}
              />
            }
            label={t.feedback.attachScreenshot}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<AddPhotoAlternateIcon />}
              disabled={uploads.length >= MAX_UPLOADS || status === "sending"}
            >
              {t.feedback.addImage}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                disabled={status === "sending"}
                onChange={event => addUploads(event.target)}
              />
            </Button>
            {uploads.map(upload => (
              <Chip
                key={upload.id}
                label={upload.name}
                disabled={status === "sending"}
                onDelete={() => {
                  updateUploads(
                    uploadsRef.current.filter(other => other !== upload),
                  );
                  setUploadError(undefined);
                }}
                sx={{ maxWidth: 1 }}
              />
            ))}
          </Box>
          {uploadError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {uploadError}
            </Typography>
          )}
          {status === "failed" && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {fill(t.feedback.failed, {
                email: <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>,
              })}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{t.cancel}</Button>
          <Button
            disabled={!message.trim() || pendingUploads > 0}
            loading={status === "sending"}
            onClick={send}
            startIcon={<SendIcon />}
          >
            {t.feedback.send}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default FeedbackDialog;
