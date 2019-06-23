import React, { useEffect } from "react";
import executeAction from "../../api/executeAction";
import {
  actionFailed,
  actionSuccessful,
  ReducerEvent,
  resetState
} from "./events";
import { LocalStorageLedgerActionMemory } from "./ledgerActionMemory";
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
        const ledgerActionMemory = new LocalStorageLedgerActionMemory(
          window.localStorage
        );
        const actionName = sideEffect.payload.actionName;
        const swapId = sideEffect.payload.swapId;
        const transactionId = sideEffect.payload.transactionId;

        ledgerActionMemory.rememberActionExecution(
          actionName,
          swapId,
          transactionId
        );
      }
      // falls through
      case "reloadData": {
        reload();
        return dispatch(resetState());
      }
    }
  }, [sideEffect, reload, dispatch]);
}
