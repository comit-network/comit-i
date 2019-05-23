import { Typography } from "@material-ui/core";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import getComitResource from "../api/getComitResource";
import { GetSwapResponse } from "../api/swapResource";
import { GetSwapsResponse } from "../api/swapsResource";
import CenteredProgress from "../components/CenteredProgress";
import SwapList from "./ListSwaps/ListSwaps";
import Swap from "./SwapPage/Swap";

const getComitResourceFn = async ({ resourcePath }: any) => {
  return getComitResource(resourcePath);
};

function ShowResource({ location }: RouteComponentProps) {
  const resourcePath = location.pathname.replace("/show_resource/", "");

  const { data, isLoading } = useAsync({
    promiseFn: getComitResourceFn,
    resourcePath
  });

  if (isLoading) {
    return <CenteredProgress title="Fetching..." />;
  } else if (data && data.class.includes("swaps")) {
    const resource = data as GetSwapsResponse;
    return <SwapList swaps={resource.entities} />;
  } else if (data && data.class.includes("swap")) {
    return <Swap swap={data as GetSwapResponse} />;
  } else {
    return <Typography variant="display2">Resource not found</Typography>;
  }
}

export default ShowResource;
