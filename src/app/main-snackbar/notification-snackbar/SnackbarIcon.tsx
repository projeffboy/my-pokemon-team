import InfoOutlined from "@mui/icons-material/InfoOutlined";
import ErrorOutlined from "@mui/icons-material/ErrorOutlined";
import WarningAmber from "@mui/icons-material/WarningAmber";
import Link from "@mui/icons-material/Link";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Undo from "@mui/icons-material/Undo";
import Redo from "@mui/icons-material/Redo";
import Casino from "@mui/icons-material/Casino";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FileCopy from "@mui/icons-material/FileCopy";
import Add from "@mui/icons-material/Add";
import FileUpload from "@mui/icons-material/FileUpload";
import FileDownload from "@mui/icons-material/FileDownload";
import Send from "@mui/icons-material/Send";
import type { SnackbarKind } from "@/types";

const icons = {
  info: InfoOutlined,
  error: ErrorOutlined,
  warning: WarningAmber,
  link: Link,
  copy: ContentCopy,
  undo: Undo,
  redo: Redo,
  random: Casino,
  delete: DeleteOutlined,
  duplicate: FileCopy,
  add: Add,
  import: FileUpload,
  export: FileDownload,
  send: Send,
};

export default function SnackbarIcon({ kind }: { kind: SnackbarKind }) {
  const Icon = icons[kind];
  return <Icon sx={{ fontSize: 20, flexShrink: 0 }} />;
}
