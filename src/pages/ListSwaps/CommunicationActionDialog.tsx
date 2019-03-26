import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, { useReducer } from "react";
import postAction from "../../api/post_action";

interface Action {
  name: string;
  url: string;
}

interface AcceptActionField {
  name: string;
  value: string;
}

function acceptReducer(currentState: object, field: AcceptActionField) {
  return { ...currentState, [field.name]: field.value };
}

interface CommunicationActionDialogProps {
  action: Action;
  acceptFields: string[];
  onClose: () => void;
}

function CommunicationActionDialog({
  action,
  acceptFields,
  onClose
}: CommunicationActionDialogProps) {
  const initialAcceptRequest = {};
  const [acceptBody, dispatchAccept] = useReducer(
    acceptReducer,
    initialAcceptRequest
  );
  const handleCloseDialog = () => {
    onClose();
  };

  const chooseComponents = (actionName: string) => {
    switch (actionName) {
      case "decline":
        return [
          null,
          <Button
            key={actionName + "-button"}
            onClick={() => {
              postAction(action.url).then(handleCloseDialog);
            }}
            color="primary"
          >
            {"Decline"}
          </Button>
        ];
      case "accept": {
        return [
          <React.Fragment key="accept-form">
            {acceptFields.map(field => (
              <TextField
                key={field}
                required={true}
                label={field}
                value={acceptBody[field] || ""}
                onChange={event =>
                  dispatchAccept({
                    name: field,
                    value: event.target.value
                  })
                }
              />
            ))}
          </React.Fragment>,
          <Button
            key={actionName + "-button"}
            onClick={() => {
              postAction(action.url, acceptBody).then(handleCloseDialog);
            }}
            color="primary"
          >
            {"Accept"}
          </Button>
        ];
      }
      default: {
        return [];
      }
    }
  };

  const [content, button] = chooseComponents(action.name);

  return (
    <Dialog open={true} onClose={handleCloseDialog}>
      <DialogTitle>{action.name}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {button}
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommunicationActionDialog;
