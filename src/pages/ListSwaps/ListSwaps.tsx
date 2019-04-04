import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { useState } from "react";
import { useAsync } from "react-async";
import getSwaps, { Swap } from "../../api/getSwaps";
import CenteredProgress from "../../components/CenteredProgress";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import EmptySwapListTableRow from "./EmptySwapListTableRow";
import SwapRow from "./SwapRow";

function FetchSwaps() {
  const { isLoading, data, error } = useAsync({
    promiseFn: getSwaps
  });
  const [displayError, setDisplayError] = useState(!error);

  if (isLoading) {
    return <CenteredProgress />;
  } else if (error) {
    return (
      <React.Fragment>
        <SwapList swaps={[]} />
        <ErrorSnackbar
          message={"Failed to fetch swaps. Is your COMIT node running?"}
          onClose={() => setDisplayError(false)}
          open={displayError}
        />
      </React.Fragment>
    );
  } else {
    return <SwapList swaps={data as Swap[]} />;
  }
}

interface SwapListProps {
  swaps: Swap[];
}

function SwapList({ swaps }: SwapListProps) {
  const hasSwaps = swaps.length !== 0;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Alpha Ledger</TableCell>
          <TableCell component="th">Alpha Asset</TableCell>
          <TableCell component="th">Beta Ledger</TableCell>
          <TableCell component="th">Beta Asset</TableCell>
          <TableCell component="th">Protocol</TableCell>
          <TableCell component="th">Status</TableCell>
          <TableCell component="th">Role</TableCell>
          <TableCell component="th">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hasSwaps && swaps.map(SwapRow)}
        {!hasSwaps && <EmptySwapListTableRow />}
      </TableBody>
    </Table>
  );
}

export default FetchSwaps;
