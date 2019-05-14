import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import getSwap from "../../api/getSwap";

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

  const { data } = useAsync({ promiseFn: getSwapFn, protocol, swapId });

  return (
    <React.Fragment>
      <div>Look at that swap! {JSON.stringify(data)}</div>{" "}
    </React.Fragment>
  );
}

export default SwapPage;
