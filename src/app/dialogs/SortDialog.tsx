import { useId } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { SortKey } from "@/types";
import { SORT_OPTIONS } from "@/store/sorting";

// The order of the Name dropdown's options
const SortDialog = observer(function SortDialog() {
  const titleId = useId();
  const isOpen = store.dialog?.name === "sort";
  const close = () => store.closeDialog();

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id={titleId}>Sort</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel id={`${titleId}-by`}>Sort by</FormLabel>
            <RadioGroup
              aria-labelledby={`${titleId}-by`}
              value={store.sort.by}
              onChange={event =>
                (store.sort.by = event.target.value as SortKey)
              }
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              {SORT_OPTIONS.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio size="small" />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id={`${titleId}-order`} sx={{ mb: 1 }}>
              Order
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={store.sort.descending ? "descending" : "ascending"}
              onChange={(_event, value: string | null) => {
                if (value) store.sort.descending = value === "descending";
              }}
              aria-labelledby={`${titleId}-order`}
            >
              <ToggleButton value="ascending">Ascending</ToggleButton>
              <ToggleButton value="descending">Descending</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Done</Button>
      </DialogActions>
    </Dialog>
  );
});

export default SortDialog;
