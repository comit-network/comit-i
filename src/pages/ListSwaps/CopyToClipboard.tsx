import { Button, Tooltip } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import copyToClipboard from "copy-to-clipboard";
import React from "react";

interface CopyToClipboardProps {
  element: string;
  name?: string;
}

function CopyToClipboard({ element, name }: CopyToClipboardProps) {
  return (
    <Tooltip disableHoverListener={true} title={"Copied!"} placement={"top"}>
      <Button onClick={() => copyToClipboard(element)} color="primary">
        <FileCopy fontSize={"small"} />
        &nbsp;Copy {name} to clipboard
      </Button>
    </Tooltip>
  );
}

export default CopyToClipboard;
