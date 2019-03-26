import { Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React from "react";

export default function SendButton() {
  return (
    <Button
      data-cy="send-button"
      type="submit"
      variant="contained"
      color="primary"
    >
      Send&nbsp;
      <SendIcon />
    </Button>
  );
}
