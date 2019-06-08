import { Button } from "@material-ui/core";
import React from "react";
import { Action } from "../../gen/siren";

interface ActionButtonProps {
  action: Action;
  onClick: (e: any) => void;
}

function ActionButton({ action, onClick }: ActionButtonProps) {
  return (
    <Button
      data-cy={`${action.name}-button`}
      type={"button"}
      key={action.name}
      variant={"contained"}
      onClick={onClick}
    >
      {action.title || action.name}
    </Button>
  );
}

export default ActionButton;
