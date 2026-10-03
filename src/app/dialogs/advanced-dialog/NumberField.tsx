import { useState } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

// A number input that shows the text being typed, which may be empty, until
// editing ends. It reports a number, or undefined while it is empty.
export default function NumberField({
  value,
  onChange,
  ...props
}: Omit<TextFieldProps, "value" | "onChange" | "onBlur" | "type"> & {
  value: number;
  onChange: (value: number | undefined) => void;
}) {
  const [text, setText] = useState<string>();

  return (
    <TextField
      {...props}
      type="number"
      value={text ?? value}
      onChange={event => {
        setText(event.target.value);
        onChange(
          event.target.value === "" ? undefined : Number(event.target.value),
        );
      }}
      onBlur={() => setText(undefined)}
    />
  );
}
