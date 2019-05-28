import { Typography } from "@material-ui/core";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import getComitResource from "../api/getComitResource";
import { GetSwapResponse } from "../api/swapResource";
import { GetSwapsResponse } from "../api/swapsResource";
import CenteredProgress from "../components/CenteredProgress";
import ErrorSnackbar from "../components/ErrorSnackbar";
import SwapList from "./ListSwaps/ListSwaps";
import Swap from "./SwapPage/Swap";

const getComitResourceFn = async ({ resourcePath }: any) => {
  return getComitResource(resourcePath);
};

function ShowResource({ location }: RouteComponentProps) {
  const resourcePath = location.pathname.replace("/show_resource/", "");

  const { data, isLoading, error } = useAsync({
    promiseFn: getComitResourceFn,
    resourcePath,
    watch: location.pathname
  });

  if (isLoading) {
    return <CenteredProgress title="Fetching..." />;
  } else if (!error && data && data.class.includes("swaps")) {
    const resource = data as GetSwapsResponse;
    return <SwapList swaps={resource.entities} />;
  } else if (!error && data && data.class.includes("swap")) {
    return <Swap swap={data as GetSwapResponse} />;
  } else {
    const title = error ? "404 Resource Not Found" : "400 Bad JSON";
    return (
      <React.Fragment>
        <Typography variant="display2">{title}</Typography>
        {error && (
          <ErrorSnackbar
            message="Failed to fetch resource. Is your COMIT node running?"
            open={true}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ShowResource;
