import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, { useReducer } from "react";
import postAction from "../../api/postAction";

interface Action {
  name: string;
  url: uri.URI;
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
  const handleSentResponse = () => {
    onClose();
    location.reload();
  };

  switch (action.name) {
    case "decline":
      return (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Decline</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                postAction(action.url).then(handleSentResponse);
              }}
              color="primary"
            >
              Decline
            </Button>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );

    case "accept":
      return (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Accept</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                postAction(action.url, acceptBody).then(handleSentResponse);
              }}
              color="primary"
            >
              Accept
            </Button>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    default: {
      return null;
    }
  }
}

export default CommunicationActionDialog;
