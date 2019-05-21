import Typography from "@material-ui/core/Typography";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import getSwap from "../../api/getSwap";
import CenteredProgress from "../../components/CenteredProgress";
import Swap from "./Swap";

const getSwapFn = async ({ protocol, swapId }: any) => {
  return getSwap(protocol, swapId);
};

interface MatchParams {
  protocol: string;
  swapId: string;
}

interface SwapPageProps extends RouteComponentProps<MatchParams> {}

function SwapPage({ match }: SwapPageProps) {
  const protocol = match.params.protocol;
  const swapId = match.params.swapId;

  const { data, isLoading } = useAsync({
    promiseFn: getSwapFn,
    protocol,
    swapId
  });

  if (isLoading) {
    return <CenteredProgress title="Fetching swap..." />;
  } else if (data) {
    return <Swap swap={data} />;
  } else {
    /* TODO: Handle the error */
    return <Typography variant="display2">Swap not found</Typography>;
  }
}

export default SwapPage;
