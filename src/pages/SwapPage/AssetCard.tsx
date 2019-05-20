import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import classnames from "classnames";
import moment from "moment";
import React, { useState } from "react";
import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";
import { Asset, Ledger } from "../../api/getSwap";

function toMainUnit(asset: Asset) {
  switch (asset.name) {
    case "ether":
      return fromWei(asset.quantity, "ether") + " ETH";
    case "bitcoin":
      return toBitcoin(asset.quantity) + " BTC";
    default:
      return asset.quantity + asset.name;
  }
}

const useStyles = makeStyles(theme => ({
  /* card: {
   *   flexBasis: "100%",
   *   maxWidth: "20vmax",
   *   minWidth: "20vmin"
   * }, */
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

interface AssetCardProps {
  title: string;
  ledger: Ledger;
  asset: Asset;
  tradeAction: string;
  expiry: number;
}

/* TODO: Handle the fact that this code is specific to RFC003 due
   to the inclusion of expiry */
function AssetCard({
  title,
  ledger,
  asset,
  tradeAction,
  expiry
}: AssetCardProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={
          tradeAction +
          " " +
          toMainUnit(asset) +
          " on " +
          ledger.name +
          " " +
          ledger.network
        }
      />
      <CardActions className={classes.actions}>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
        <CardContent>
          <Typography paragraph={true}>
            Smart contract refund branch active at{" "}
            {moment.unix(expiry).format("MMMM Do YYYY, h:mm a")} {ledger.name}{" "}
            time.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default AssetCard;
