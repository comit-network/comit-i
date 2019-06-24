import { Card, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import { Link } from "../../../gen/siren";
import { Protocol } from "../../api/swapTypes";
import ExternalLink from "../../components/ExternalLink";

interface SwapMetaDataCardProps {
  swapId: string;
  counterparty: string;
  protocol: Protocol;
  protocolSpecLink: Link | undefined;
}

function SwapMetaDataCard({
  swapId,
  counterparty,
  protocol,
  protocolSpecLink
}: SwapMetaDataCardProps) {
  return (
    <Card data-cy="swap-metadata-card">
      <CardContent>
        <Typography>{`Swap ID: ${swapId}`}</Typography>
        <Typography>{`Trading with: ${counterparty}`}</Typography>
        <Typography display="inline">Protocol: </Typography>
        <Typography display="inline">
          {protocolSpecLink ? (
            <ExternalLink href={protocolSpecLink.href} text={protocol} />
          ) : (
            protocol
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SwapMetaDataCard;
