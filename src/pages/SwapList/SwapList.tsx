import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React from "react";
import { EmbeddedRepresentationSubEntity } from "../../../gen/siren";
import EmptySwapListTableRow from "./EmptySwapListTableRow";
import SwapRow from "./SwapRow/SwapRow";

interface SwapListProps {
  swaps: EmbeddedRepresentationSubEntity[];
  reload: () => void;
  setAllowReload: (arg: boolean) => void;
}

function SwapList({ swaps, reload, setAllowReload }: SwapListProps) {
  const hasSwaps = swaps.length !== 0;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Status</TableCell>
          <TableCell component="th">ID</TableCell>
          <TableCell component="th">Buy</TableCell>
          <TableCell component="th">Sell</TableCell>
          <TableCell component="th">Protocol</TableCell>
          <TableCell component="th">Role</TableCell>
          <TableCell component="th">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hasSwaps &&
          swaps.map((swap, index) => (
            <SwapRow
              key={index}
              swap={swap}
              reload={reload}
              setAllowReload={setAllowReload}
            />
          ))}
        {!hasSwaps && <EmptySwapListTableRow />}
      </TableBody>
    </Table>
  );
}

export default SwapList;
