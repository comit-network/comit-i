import React from "react";
import TextField from "./TextField";

interface PeerAddressHintTextFieldProps {
  addressHint: string;
  onAddressHintChange?: (newAddressHint: string) => void;
  disabled?: boolean;
}

export default function PeerAddressHintTextField({
  addressHint,
  onAddressHintChange = () => undefined,
  disabled = false
}: PeerAddressHintTextFieldProps) {
  return (
    <TextField
      value={addressHint}
      label={"Peer Address Hint"}
      helperText={
        "Multiaddress format, to be dialed to help with resolution of the peer ID"
      }
      data-cy="address-hint-input"
      onChange={event => onAddressHintChange(event.target.value)}
      required={false}
      disabled={disabled}
    />
  );
}
