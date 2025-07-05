import Fab from "@material-ui/core/Fab";
import TableChart from "@material-ui/icons/TableChart";

import React from "react";
// Material UI Core Imports
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TypeChart from "./type-chart";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isDialogOpen: false };
  }

  fab() {
    if (this.props.width === "xs") {
      return (
        <Fab
          onClick={this.toggleDialog}
          color="primary"
          variant="round"
          size="small"
          style={{ position: "fixed", bottom: 116, right: 16 }}
        >
          <TableChart />
        </Fab>
      );
    } else if (this.props.width === "sm") {
      return (
        <Fab
          onClick={this.toggleDialog}
          color="primary"
          variant="round"
          size="large"
          style={{ position: "fixed", bottom: 116, right: 24 }}
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
