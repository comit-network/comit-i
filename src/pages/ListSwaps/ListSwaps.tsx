import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import getSwaps, { Asset, Swap } from "../../api/get_swaps";
import CenteredProgress from "../../components/CenteredProgress";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import EmptySwapListTableRow from "./EmptySwapListTableRow";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  switch (asset.name) {
    case "Ether": {
      return <span>{asset.quantity} wei</span>;
    }
    case "Bitcoin": {
      return <span>{asset.quantity} sats</span>;
    }
    default: {
      return (
        <span>
          {asset.quantity} {asset.name}
        </span>
      );
    }
  }
}

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
        {hasSwaps &&
          swaps.map(row => (
            <TableRow key={row._links.self.href} data-cy="swap-row">
              <TableCell>{row.parameters.alpha_ledger.name}</TableCell>
              <TableCell>
                <AssetCell asset={row.parameters.alpha_asset} />
              </TableCell>
              <TableCell>{row.parameters.beta_ledger.name}</TableCell>
              <TableCell>
                <AssetCell asset={row.parameters.beta_asset} />
              </TableCell>
              <TableCell>{row.protocol}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                {Object.keys(row._links).filter(key => key !== "self")}
              </TableCell>
            </TableRow>
          ))}
        {!hasSwaps && <EmptySwapListTableRow />}
      </TableBody>
    </Table>
  );
}

export default FetchSwaps;
