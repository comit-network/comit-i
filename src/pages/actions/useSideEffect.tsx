import React, { useEffect } from "react";
import executeAction from "../../api/executeAction";
import { actionFailed, actionSuccessful, ReducerEvent } from "./events";
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
      case "reloadData": {
        reload();
        return;
      }
      case "executeAction": {
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response => dispatch(actionSuccessful(response)),
          error => dispatch(actionFailed(error))
        );
        return;
      }
    }
  }, [sideEffect, reload, dispatch]);
}
