import { AxiosResponse } from "axios";
import ContentType from "content-type";
import { Action } from "../../../gen/siren";
import { LedgerAction } from "../../api/getAction";
import { ReducerEvent } from "./events";

interface ReducerState {
  state: State;
  sideEffect?: SideEffect;
}

export type SideEffect =
  | {
      type: "executeAction";
      payload: {
        action: Action;
        data: any;
      };
    }
  | {
      type: "reloadData";
    }
  | {
      type: "updateActionRecord";
      payload: {
        actionName: string;
        swapId: string;
        transactionId?: string;
      };
    };

interface State {
  actionExecutionStatus?: ActionExecutionStatus;
  activeSirenParameterDialog?: Action;
  activeLedgerActionDialog?: LedgerAction;
  activeLedgerActionName?: string;
}

export enum ActionExecutionStatus {
  InProgress,
  Done,
  Error
}

export function reducer(
  { state }: ReducerState,
  event: ReducerEvent
): ReducerState {
  switch (event.type) {
    case "actionButtonClicked": {
      const action = event.payload.action;

      const fields = action.fields || [];
      if (fields.length > 0) {
        return {
          state: {
            activeSirenParameterDialog: action
          }
        };
      } else {
        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.InProgress
          },
          sideEffect: {
            type: "executeAction",
            payload: {
              action,
              data: {}
            }
          }
        };
      }
    }

    case "actionSuccessful": {
      const response = event.payload.response;
      const body = response.data;

      if (
        body &&
        isMediaTypeApplicationJson(response) &&
        body.type &&
        body.payload
      ) {
        const ledgerAction = body as LedgerAction;
        const ledgerActionName = event.payload.actionName;

        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.Done,
            activeLedgerActionDialog: ledgerAction,
            activeLedgerActionName: ledgerActionName
          }
        };
      } else {
        return {
          state: {
            actionExecutionStatus: ActionExecutionStatus.Done
          },
          sideEffect: {
            type: "reloadData"
          }
        };
      }
    }

    case "actionFailed": {
      return {
        state: {
          actionExecutionStatus: ActionExecutionStatus.Error
        }
      };
    }

    case "sirenParameterDialogSubmitted": {
      return {
        state: {
          actionExecutionStatus: ActionExecutionStatus.InProgress
        },
        sideEffect: {
          type: "executeAction",
          payload: {
            action: event.payload.action,
            data: event.payload.data
          }
        }
      };
    }

    case "ledgerActionConfirmed": {
      return {
        state: {},
        sideEffect: {
          type: "updateActionRecord",
          payload: event.payload
        }
      };
    }

    case "closeLedgerActionDialog": {
      return {
        state: {},
        sideEffect: {
          type: "reloadData"
        }
      };
    }

    case "closeSirenParametersDialog":
    case "resetState":
      return initialState;
  }

  return { state };
}

function isMediaTypeApplicationJson(response: AxiosResponse) {
  try {
    return ContentType.parse(response).type === "application/json";
  } catch (e) {
    return false;
  }
}

export const initialState: ReducerState = {
  state: {}
};
