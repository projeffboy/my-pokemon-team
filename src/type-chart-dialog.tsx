import Fab from "@mui/material/Fab";
import TableChart from "@mui/icons-material/TableChart";

import React from "react";
// Material UI Core Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TypeChart from "./type-chart";
import { Breakpoint } from "./types";

interface Props {
  width: Breakpoint;
}

interface State {
  isDialogOpen: boolean;
}

export default class TypeChartDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { isDialogOpen: false };
  }

  fab() {
    if (this.props.width === "xs") {
      return (
        <Fab
          onClick={this.toggleDialog}
          color="primary"
          variant="circular"
          size="small"
          style={{ position: "fixed", bottom: 116, right: 16 }}
          aria-label="Type Chart"
        >
          <TableChart />
        </Fab>
      );
    } else if (this.props.width === "sm") {
      return (
        <Fab
          onClick={this.toggleDialog}
          color="primary"
          variant="circular"
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
          onClick={this.toggleDialog}
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
  }

  toggleDialog = () =>
    this.setState({ isDialogOpen: !this.state.isDialogOpen });

  render() {
    return (
      <>
        {this.fab()}
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.toggleDialog}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <TypeChart width={this.props.width} />
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
