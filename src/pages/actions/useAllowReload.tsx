import { useEffect } from "react";
import { Action } from "../../../gen/siren";
import { LedgerAction } from "../../api/getAction";

export default function useAllowReload(
  activeLedgerActionDialog: LedgerAction | undefined,
  activeSirenParameterDialog: Action | undefined,
  setAllowReload: (arg: boolean) => void
) {
  useEffect(() => {
    setAllowReload(!!activeLedgerActionDialog || !!activeSirenParameterDialog);
  }, [activeLedgerActionDialog, activeSirenParameterDialog, setAllowReload]);
}
