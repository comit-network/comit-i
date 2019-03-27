import React from "react";
import TextField from "./TextField";

interface ProtocolTextFieldProps {
  protocol: string;
  onChange?: (protocol: string) => void;
  disabled?: boolean;
}

export default function ProtocolTextField({
  protocol,
  onChange = () => undefined,
  disabled = false
}: ProtocolTextFieldProps) {
  return (
    <TextField
      label={"Protocol"}
      required={true}
      value={protocol}
      onChange={event => onChange(event.target.value)}
      select={true}
      SelectProps={{
        native: true
      }}
      data-cy="protocol-select"
      disabled={disabled}
    >
      <option value={""} />
      <option value={"rfc003"}>RFC003</option>
    </TextField>
  );
}
