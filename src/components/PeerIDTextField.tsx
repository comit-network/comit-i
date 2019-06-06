import React from "react";
import TextField from "./TextField";

interface PeerIDTextFieldProps {
  peerID: string;
  onPeerIDChange?: (newPeerID: string) => void;
  disabled?: boolean;
}

export default function PeerIDTextField({
  peerID,
  onPeerIDChange = () => undefined,
  disabled = false
}: PeerIDTextFieldProps) {
  return (
    <TextField
      value={peerID}
      label={"Peer"}
      helperText={"Peer ID"}
      data-cy="peer-input"
      onChange={event => onPeerIDChange(event.target.value)}
      required={true}
      disabled={disabled}
    />
  );
}
