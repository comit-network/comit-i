import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import getSwaps, { Swap } from "../../api/get_swaps";
import CenteredProgress from "../../components/CenteredProgress";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import EmptySwapListTableRow from "./EmptySwapListTableRow";
import SwapRow from "./SwapRow";

function FetchSwaps() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    setLoading(() => true);
    getSwaps()
      .then(fetchedSwaps => setSwaps(() => fetchedSwaps))
      .catch(() => setDisplayError(true))
      .finally(() => setLoading(false));
  }, []);

  const hideError = () => setDisplayError(false);

  return (
    <React.Fragment>
      {loading ? <CenteredProgress /> : <SwapList swaps={swaps} />}
      <ErrorSnackbar
        message={"Failed to fetch swaps. Is your COMIT node running?"}
        onClose={hideError}
        open={displayError}
      />
    </React.Fragment>
  );
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
