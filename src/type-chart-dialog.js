import Fab from "@mui/material/Fab";
import TableChart from "@mui/icons-material/TableChart";

import { useState } from "react";
// Material UI Core Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TypeChart from "./type-chart";

const TypeChartDialog = ({ width }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const renderFab = () => {
    if (width === "xs") {
      return (
        <Fab
          onClick={toggleDialog}
          color="primary"
          variant="round"
          size="small"
          style={{ position: "fixed", bottom: 116, right: 16 }}
          aria-label="Type Chart"
        >
          <TableChart />
        </Fab>
      );
    } else if (width === "sm") {
      return (
        <Fab
          onClick={toggleDialog}
          color="primary"
          variant="round"
          size="large"
          style={{ position: "fixed", bottom: 116, right: 24 }}
          aria-label="Type Chart"
        >
          <TableChart />
        </Fab>
      );
    } else {
      return (
        <Fab
          onClick={toggleDialog}
          color="primary"
          variant="extended"
          size="large"
          style={{ position: "fixed", bottom: 116, right: 24 }}
        >
          <TableChart style={{ marginRight: 8 }} />
          Type Chart
        </Fab>
      );
    }
  };

  return (
    <>
      {renderFab()}
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <TypeChart width={width} />
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Go Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TypeChartDialog;
