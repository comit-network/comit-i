import { Card, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import React from "react";

interface SwapMetaDataCardProps {
  counterparty: string;
}

function SwapMetaDataCard({ counterparty }: SwapMetaDataCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography>{`Other party: ${counterparty}`}</Typography>
      </CardContent>
    </Card>
  );
}

export default SwapMetaDataCard;
