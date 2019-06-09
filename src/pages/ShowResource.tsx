import { CircularProgress, Typography } from "@material-ui/core";
import useInterval from "@use-it/interval";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useAsync } from "react-async";
import { RouteComponentProps } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../gen/siren";
import getComitResource from "../api/getComitResource";
import ErrorSnackbar from "../components/ErrorSnackbar";
import Snackbar from "../components/Snackbar";
import SwapList from "./SwapList/SwapList";
import Swap from "./SwapPage/Swap";

const getComitResourceFn = async ({ resourcePath }: any) => {
  return getComitResource(resourcePath);
};

function ShowResource({ location }: RouteComponentProps) {
  const resourcePath = location.pathname.replace("/show_resource/", "");
  const [showLoading, setShowLoading] = useState(false);

  const { data: entity, isLoading, error, reload } = useAsync(
    getComitResourceFn,
    {
      resourcePath,
      watch: location.pathname
    }
  );
  const axiosError = error as AxiosError;

  useEffect(() => {
    setShowLoading(true);
  }, [isLoading]);

  useInterval(() => reload(), isLoading ? null : 15000);

  let resource;
  if (entity && entity.class && entity.class.includes("swaps")) {
    resource = (
      <SwapList
        swaps={entity.entities as EmbeddedRepresentationSubEntity[]}
        reload={reload}
      />
    );
  } else if (entity && entity.class && entity.class.includes("swap")) {
    resource = <Swap swap={entity} reload={reload} />;
  } else if (axiosError) {
    if (
      axiosError.response &&
      axiosError.response.status &&
      Math.floor(axiosError.response.status / 100) !== 2
    ) {
      resource = (
        <Typography variant="h3" align="center" data-cy="404-typography">
          404 Resource Not Found
        </Typography>
      );
    } else {
      // Network error
      resource = (
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
  } else if (!entity) {
    resource = null;
  } else {
    resource = (
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

  return (
    <React.Fragment>
      {resource}
      <Snackbar
        open={showLoading}
        onClose={() => setShowLoading(false)}
        message="Loading"
        icon={CircularProgress}
        backgroundPaletteVariant="primary"
        backgroundColor="light"
        autoHideDuration={3000}
      />
    </React.Fragment>
  );
}

export default ShowResource;
