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
  const [uploadError, setUploadError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const close = () => {
    setIsOpen(false);
    setStatus("idle");
  };

  const addUploads = async (input: HTMLInputElement) => {
    const files = Array.from(input.files ?? []);
    // Lets the same file be picked again after it is removed
    input.value = "";
    let added = uploads;
    let error: string | undefined;
    for (const file of files.slice(0, MAX_UPLOADS - uploads.length)) {
      const dataUrl = await compressImage(file).catch(() => undefined);
      if (!dataUrl) {
        error = t.feedback.imageUnreadable;
      } else if (totalLength(added) + dataUrl.length > MAX_UPLOADS_LENGTH) {
        error = t.feedback.imagesTooLarge;
      } else {
        added = [...added, { id: nextUploadId++, name: file.name, dataUrl }];
      }
    }
    setUploads(added);
    setUploadError(error);
  };

  const send = async () => {
    setStatus("sending");
    const screenshot =
      attachScreenshot &&
      (await capturePage(
        dialogRef.current,
        MAX_IMAGES_LENGTH - totalLength(uploads),
      ));
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
    if (!response?.ok) {
      setStatus("failed");
      return;
    }
    setMessage("");
    setUploads([]);
    setUploadError(undefined);
    close();
    store.openSnackbar(t.feedback.sent);
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
            onChange={event => setEmail(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 254 } }}
          />
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={attachLink}
                onChange={event => setAttachLink(event.target.checked)}
              />
            }
            label={t.feedback.attachLink}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={attachScreenshot}
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
              disabled={uploads.length >= MAX_UPLOADS}
            >
              {t.feedback.addImage}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={event => addUploads(event.target)}
              />
            </Button>
            {uploads.map(upload => (
              <Chip
                key={upload.id}
                label={upload.name}
                onDelete={() => {
                  setUploads(uploads.filter(other => other !== upload));
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
            disabled={!message.trim()}
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
