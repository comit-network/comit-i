import assert from "assert";
import { Location } from "history";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URI from "urijs";
import UUID from "uuidjs";
import getSwap from "../../api/getSwap";

function parseSwap(location: Location) {
  try {
    const uri = new URI(URI.decode(location.pathname));
    const pathSegments = uri.segment();

    assert(pathSegments.length === 3);

    const protocol = pathSegments[1];
    const swapId = pathSegments[2];

    assert(protocol === "rfc003");
    assert(UUID.parse(swapId));

    const swap = { protocol, swapId };

    return {
      ...swap,
      error: false
    };
  } catch (error) {
    return {
      protocol: "",
      swapId: "",
      error: true
    };
  }
}

const getSwapFn = async ({ protocol, swapId }: any) => {
  return getSwap(protocol, swapId);
};

function SwapPage({ location }: RouteComponentProps) {
  const { protocol, swapId, error } = parseSwap(location);

  if (error) {
    return (
      <React.Fragment>
        <div>No swap at {location.pathname}</div>
      </React.Fragment>
    );
  }

  const { data } = useAsync({ promiseFn: getSwapFn, protocol, swapId });

  return (
    <React.Fragment>
      <div>Look at that swap! {JSON.stringify(data)}</div>{" "}
    </React.Fragment>
  );
}

export default withRouter(SwapPage);
