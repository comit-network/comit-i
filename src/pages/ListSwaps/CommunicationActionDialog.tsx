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
  key: string;
  value: string;
}

interface AcceptField {
  key: string;
  label: string;
}

function acceptReducer(currentState: object, field: AcceptActionField) {
  return { ...currentState, [field.key]: field.value };
}

interface CommunicationActionDialogProps {
  action: Action;
  acceptFields: AcceptField[];
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
                key={field.key}
                required={true}
                label={field.label}
                value={acceptBody[field.key] || ""}
                onChange={event =>
                  dispatchAccept({
                    key: field.key,
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
