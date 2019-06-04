import { Grid } from "@material-ui/core";
import React from "react";
import Fieldset from "../components/Fieldset";
import TextField from "../components/TextField";

interface Props {
  peerId: string;
  addressHint: string;
  onPeerChange?: (event: any) => void;
  onAddressHintChange?: (event: any) => void;
  disabled?: boolean;
}

function ToForm({
  peerId,
  addressHint,
  onPeerChange = () => undefined,
  onAddressHintChange = () => undefined,
  disabled = false
}: Props) {
  return (
    <React.Fragment>
      <Fieldset legend={"To"}>
        <Grid item={true} xs={12}>
          <TextField
            value={peerId}
            label={"Peer"}
            helperText={"Peer ID"}
            data-cy="peer-input"
            onChange={onPeerChange}
            required={true}
            disabled={disabled}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            value={addressHint}
            label={"Peer Address Hint"}
            helperText={
              "Multiaddress format, to be dialed to help with resolution of the peer ID"
            }
            data-cy="address-hint-input"
            onChange={onAddressHintChange}
            required={false}
            disabled={disabled}
          />
        </Grid>
      </Fieldset>
    </React.Fragment>
  );
}

export default ToForm;
