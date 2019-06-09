import { Typography } from "@material-ui/core";
import { AxiosError } from "axios";
/* import useInterval from "@use-it/interval"; */
import React from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../gen/siren";
import getComitResource from "../api/getComitResource";
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
  const axiosError = error as AxiosError;

  /* useInterval(() => reload(), isLoading ? null : 15000); */

  if (entity && entity.class && entity.class.includes("swaps")) {
    return (
      <SwapList
        swaps={entity.entities as EmbeddedRepresentationSubEntity[]}
        reload={reload}
      />
    );
  } else if (entity && entity.class && entity.class.includes("swap")) {
    return <Swap swap={entity} reload={reload} />;
  } else if (axiosError) {
    if (
      axiosError.response &&
      axiosError.response.status &&
      Math.floor(axiosError.response.status / 100) !== 2
    ) {
      return (
        <Typography variant="h3" align="center" data-cy="404-typography">
          404 Resource Not Found
        </Typography>
      );
    } else {
      // Network error
      return (
        <React.Fragment>
          <Typography variant="h3" align="center" data-cy="404-typography">
            404 Resource Not Found
          </Typography>
          <ErrorSnackbar
            message="Failed to fetch resource. Is your COMIT node running?"
            open={true}
          />
        </React.Fragment>
      );
    }
  } else if (isLoading && !entity) {
    return null;
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
