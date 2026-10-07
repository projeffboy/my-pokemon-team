import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

export default function DialogHeader({
  id,
  title,
  onClose,
  closeLabel,
  back = false,
}: {
  id: string;
  title: string;
  onClose: () => void;
  closeLabel: string;
  back?: boolean;
}) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1,
        pl: 1,
        bgcolor: "grey.900",
        color: "common.white",
        flexShrink: 0,
      }}
    >
      <IconButton aria-label={closeLabel} onClick={onClose} color="inherit">
        {back ?
          <ArrowBackIcon />
        : <CloseIcon />}
      </IconButton>
      <Box component="span" id={id}>
        {title}
      </Box>
    </DialogTitle>
  );
}
