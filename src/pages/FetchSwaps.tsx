import React, { useEffect, useState } from "react";
import getSwaps, { Asset, Swap } from "../api/get_swaps";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

type AssetCellProps = { asset: Asset };

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

  useEffect(() => {
    getSwaps().then(swaps => setSwaps(prevState => swaps));
  }, []);

  return <SwapList swaps={swaps} />;
}

interface SwapListProps {
  swaps: Swap[];
}

function SwapList({ swaps }: SwapListProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Alpha Ledger</TableCell>
          <TableCell component="th">Alpha Asset</TableCell>
          <TableCell component="th">Beta Ledger</TableCell>
          <TableCell component="th">Beta Asset</TableCell>
          <TableCell component="th">Status</TableCell>
          <TableCell component="th">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {swaps.map(row => (
          <TableRow key={row._links["self"].href}>
            <TableCell>{row.parameters.alpha_ledger.name}</TableCell>
            <TableCell>
              <AssetCell asset={row.parameters.alpha_asset} />
            </TableCell>
            <TableCell>{row.parameters.beta_ledger.name}</TableCell>
            <TableCell>
              <AssetCell asset={row.parameters.beta_asset} />
            </TableCell>
            <TableCell>
              {row.status}
            </TableCell>
            <TableCell>
              {Object.keys(row._links).filter(key => key != "self")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FetchSwaps;
