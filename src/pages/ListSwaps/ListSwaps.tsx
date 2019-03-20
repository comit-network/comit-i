import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import getSwaps, { Asset, Swap } from "../../api/get_swaps";
import CenteredProgress from "../../components/CenteredProgress";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import ActionDialog from "./ActionDialog";
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
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentActionName, setCurrentActionName] = useState("");
  const [currentActionUrl, setCurrentActionUrl] = useState("");

  const produceActionButtons = (swap: Swap) => {
    return Object.entries(swap._links)
      .filter(([key, _]) => key !== "self")
      .map(([actionName, actionUrl]) => (
        <Button
          variant="outlined"
          color="primary"
          key={actionName}
          onClick={() => handleClickAction(actionName, actionUrl.href)}
        >
          {actionName}
        </Button>
      ));
  };

  const handleClickAction = (actionName: string, actionUrl: string) => {
    setCurrentActionName(actionName);
    setCurrentActionUrl(actionUrl);
    setActionDialogOpen(true);
  };

  return (
    <React.Fragment>
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
            swaps.map(swap => {
              return (
                <TableRow key={swap._links.self.href} data-cy="swap-row">
                  <TableCell>{swap.parameters.alpha_ledger.name}</TableCell>
                  <TableCell>
                    <AssetCell asset={swap.parameters.alpha_asset} />
                  </TableCell>
                  <TableCell>{swap.parameters.beta_ledger.name}</TableCell>
                  <TableCell>
                    <AssetCell asset={swap.parameters.beta_asset} />
                  </TableCell>
                  <TableCell>{swap.protocol}</TableCell>
                  <TableCell>{swap.status}</TableCell>
                  <TableCell>{swap.role}</TableCell>
                  <TableCell>{produceActionButtons(swap)}</TableCell>
                </TableRow>
              );
            })}
          {!hasSwaps && <EmptySwapListTableRow />}
        </TableBody>
      </Table>
      <ActionDialog
        actionName={currentActionName}
        setActionName={setCurrentActionName}
        actionUrl={currentActionUrl}
        setActionUrl={setCurrentActionUrl}
        isOpen={actionDialogOpen}
        setOpen={setActionDialogOpen}
      />
    </React.Fragment>
  );
}

export default FetchSwaps;
