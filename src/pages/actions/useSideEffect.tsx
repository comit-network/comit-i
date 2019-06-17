import React, { useEffect } from "react";
import executeAction from "../../api/executeAction";
import { actionFailed, actionSuccessful, ReducerEvent } from "./events";
import { SideEffect } from "./reducer";

export default function useSideEffect(
  reload: () => void,
  setAllowReload: (arg: boolean) => void,
  dispatch: React.Dispatch<ReducerEvent>,
  sideEffect: SideEffect | undefined
) {
  useEffect(() => {
    if (!sideEffect) {
      return;
    }

    switch (sideEffect.type) {
      case "reloadData": {
        setAllowReload(true);
        reload();
        return;
      }
      case "executeAction": {
        setAllowReload(false);
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response => dispatch(actionSuccessful(response)),
          error => dispatch(actionFailed(error))
        );
        return;
      }
      case "allowReload": {
        setAllowReload(true);
        return;
      }
      case "preventReload": {
        setAllowReload(false);
        return;
      }
    }
  }, [sideEffect, reload, setAllowReload, dispatch]);
}
