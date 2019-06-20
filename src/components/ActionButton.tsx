import { Button } from "@material-ui/core";
import React from "react";
import { Action } from "../../gen/siren";

interface ActionButtonProps {
  action: Action;
  onClick: (e: any) => void;
  actionDoneBefore?: boolean;
}

function ActionButton({
  action,
  onClick,
  actionDoneBefore = false
}: ActionButtonProps) {
  let title = action.title || action.name;
  title = actionDoneBefore ? title + " again" : title;

  return (
    <Button
      data-cy={`${action.name}-button`}
      type={"button"}
      key={action.name}
      variant={"contained"}
      onClick={onClick}
    >
      {title}
    </Button>
  );
}

export default ActionButton;
