import { TableCell, TableRow, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing.unit * 20
  }
}));

function EmptySwapListTableRow() {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell
        classes={{
          root: classes.root
        }} align={"center"} colSpan={6}>
        <Typography variant="display2">The list of swaps is empty :(</Typography>
      </TableCell>
    </TableRow>
  );
}

export default EmptySwapListTableRow;
