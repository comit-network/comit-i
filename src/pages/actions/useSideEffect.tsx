import React, { useEffect } from "react";
import executeAction from "../../api/executeAction";
import { actionFailed, actionSuccessful, ReducerEvent } from "./events";
import { LocalStorageLedgerActionStore } from "./ledgerActionStore";
import { SideEffect } from "./reducer";

export default function useSideEffect(
  sideEffect: SideEffect | undefined,
  dispatch: React.Dispatch<ReducerEvent>,
  reload: () => void
) {
  useEffect(() => {
    if (!sideEffect) {
      return;
    }

    switch (sideEffect.type) {
      case "executeAction": {
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response =>
            dispatch(
              actionSuccessful(response, sideEffect.payload.action.name)
            ),
          error => dispatch(actionFailed(error))
        );
        return;
      }
      case "updateActionRecord": {
        const ledgerActionStore = new LocalStorageLedgerActionStore(
          window.localStorage
        );
        const actionName = sideEffect.payload.actionName;
        const swapId = sideEffect.payload.swapId;
        const transactionId = sideEffect.payload.transactionId;

        ledgerActionStore.storeAction(actionName, swapId, transactionId);
      }
      // falls through
      case "reloadData": {
        reload();
        return;
      }
    }
  }, [sideEffect, reload, dispatch]);
}
