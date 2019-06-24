import { Card, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import React from "react";

interface SwapMetaDataCardProps {
  swapId: string;
  counterparty: string;
}

function SwapMetaDataCard({ swapId, counterparty }: SwapMetaDataCardProps) {
  return (
    <Card data-cy="swap-metadata-card">
      <CardContent>
        <Typography>{`Swap ID: ${swapId}`}</Typography>
        <Typography>{`Trading with: ${counterparty}`}</Typography>
      </CardContent>
    </Card>
  );
}

export default SwapMetaDataCard;
