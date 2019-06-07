import { Typography } from "@material-ui/core";
import useInterval from "@use-it/interval";
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../gen/siren";
import getComitResource from "../api/getComitResource";
import CenteredProgress from "../components/CenteredProgress";
import ErrorSnackbar from "../components/ErrorSnackbar";
import SwapList from "./SwapList/SwapList";
import Swap from "./SwapPage/Swap";

const getComitResourceFn = async ({ resourcePath }: any) => {
  return getComitResource(resourcePath);
};

function ShowResource({ location }: RouteComponentProps) {
  const resourcePath = location.pathname.replace("/show_resource/", "");

  const { data: entity, isLoading, error, reload } = useAsync(
    getComitResourceFn,
    {
      resourcePath,
      watch: location.pathname
    }
  );

  useInterval(() => reload(), isLoading ? null : 15000);

  if (isLoading) {
    return <CenteredProgress title="Fetching..." />;
  } else if (
    !error &&
    entity &&
    entity.class &&
    entity.class.includes("swaps")
  ) {
    return (
      <SwapList
        swaps={entity.entities as EmbeddedRepresentationSubEntity[]}
        reload={reload}
      />
    );
  } else if (
    !error &&
    entity &&
    entity.class &&
    entity.class.includes("swap")
  ) {
    return <Swap swap={entity} reload={reload} />;
  } else if (error) {
    return (
      <React.Fragment>
        <Typography variant="h3" align="center" data-cy="404-typography">
          404 Resource Not Found
        </Typography>
        {error && error.message === "Network Error" && (
          <ErrorSnackbar
            message="Failed to fetch resource. Is your COMIT node running?"
            open={true}
          />
        )}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography variant="h3" align="center" data-cy="bad-json-typography">
          Bad JSON
        </Typography>
        <ErrorSnackbar
          message="Could not handle comit node's response. Are your comit-i and comit node versions compatible?"
          open={true}
        />
      </React.Fragment>
    );
  }
}

export default ShowResource;
