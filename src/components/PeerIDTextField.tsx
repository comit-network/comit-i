import { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import TextField from "./TextField";

interface PeerIDTextFieldProps {
  peerID: string;
  onPeerIDChange?: (newPeerID: string) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export default function PeerIDTextField({
  peerID,
  onPeerIDChange = () => undefined,
  disabled = false,
  label = "PeerID",
  helperText = "",
  ...textFieldProps
}: PeerIDTextFieldProps & TextFieldProps) {
  return (
    <TextField
      {...textFieldProps}
      value={peerID}
      label={label}
      helperText={helperText}
      data-cy="peer-input"
      onChange={event => onPeerIDChange(event.target.value)}
      required={true}
      disabled={disabled}
    />
  );
}
