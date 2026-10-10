import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

// Below the slot tabs, until the player drags one or closes this
const DragHint = observer(function DragHint() {
  const { t } = useTranslation();

  return (
    <Collapse in={store.showDragHint} unmountOnExit>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pl: 1,
          color: "text.secondary",
          typography: "caption",
        }}
      >
        <TouchAppIcon sx={{ fontSize: 16 }} aria-hidden="true" />
        <Box>{t.team.dragHint}</Box>
        <IconButton
          size="small"
          aria-label={t.close}
          onClick={() => {
            store.knowsSlotDrag = true;
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Collapse>
  );
});

export default DragHint;
