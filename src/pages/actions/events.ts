import { AxiosResponse } from "axios";
import { Action } from "../../../gen/siren";

export type ReducerEvent =
  | {
      type: "actionButtonClicked";
      payload: {
        action: Action;
      };
    }
  | {
      type: "closeSirenParametersDialog";
    }
  | {
      type: "closeLedgerActionDialog";
    }
  | {
      type: "sirenParameterDialogSubmitted";
      payload: {
        action: Action;
        data: any;
      };
    }
  | {
      type: "actionSuccessful";
      payload: {
        response: AxiosResponse;
        actionName: string;
      };
    }
  | {
      type: "actionFailed";
      payload: {
        error: any;
      };
    }
  | {
      type: "ledgerActionConfirmed";
      payload: { swapId: string; actionName: string; transactionId?: string };
    }
  | {
      type: "resetState";
    };

export function sirenParameterDialogSubmitted(
  action: Action,
  data: any
): ReducerEvent {
  return {
    type: "sirenParameterDialogSubmitted",
    payload: {
      action,
      data
    }
  };
}

export function actionButtonClicked(action: Action): ReducerEvent {
  return {
    type: "actionButtonClicked",
    payload: {
      action
    }
  };
}

export function actionSuccessful(
  response: AxiosResponse,
  actionName: string
): ReducerEvent {
  return {
    type: "actionSuccessful",
    payload: {
      response,
      actionName
    }
  };
}

export function actionFailed(error: any): ReducerEvent {
  return {
    type: "actionFailed",
    payload: {
      error
    }
  };
}

export function closeSirenParametersDialog(): ReducerEvent {
  return {
    type: "closeSirenParametersDialog"
  };
}

export function ledgerActionConfirmed(
  swapId: string,
  actionName: string,
  transactionId?: string
): ReducerEvent {
  return {
    type: "ledgerActionConfirmed",
    payload: { swapId, actionName, transactionId }
  };
}

export function closeLedgerActionDialog(): ReducerEvent {
  return {
    type: "closeLedgerActionDialog"
  };
}

export function resetState(): ReducerEvent {
  return {
    type: "resetState"
  };
}
