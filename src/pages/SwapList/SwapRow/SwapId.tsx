import { Tooltip, Typography } from "@material-ui/core";
import React from "react";

interface SwapIdProps {
  id: string;
}

export default function SwapId({ id }: SwapIdProps) {
  const firstThree = id.slice(0, 3);
  const lastThree = id.substring(id.length - 3);

  return (
    <Tooltip title={id}>
      <Typography>{firstThree + ".." + lastThree}</Typography>
    </Tooltip>
  );
}
