import React, { useEffect } from "react";
import executeAction from "../../api/executeAction";
import { actionFailed, actionSuccessful, ReducerEvent } from "./events";
import { SideEffect } from "./reducer";

export default function useSideEffect(
  reload: () => void,
  setPreventReload: (arg: boolean) => void,
  dispatch: React.Dispatch<ReducerEvent>,
  sideEffect: SideEffect | undefined
) {
  useEffect(() => {
    if (!sideEffect) {
      return;
    }

    switch (sideEffect.type) {
      case "reloadData": {
        setPreventReload(false);
        reload();
        return;
      }
      case "executeAction": {
        setPreventReload(true);
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response => dispatch(actionSuccessful(response)),
          error => dispatch(actionFailed(error))
        );
        return;
      }
      case "allowReload": {
        setPreventReload(false);
        return;
      }
      case "preventReload": {
        setPreventReload(true);
        return;
      }
    }
  }, [sideEffect, reload, setPreventReload, dispatch]);
}
