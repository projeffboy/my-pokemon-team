import { useEffect, useEffectEvent, useRef, useState } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { verbatim } from "@/app/shared/text-entry";

// A number input that shows the text being typed, which may be empty, until
// editing ends. It reports a number, or undefined while it is empty, on each
// keystroke, and calls onCommit with the value it started from when editing
// ends.
export default function NumberField({
  value,
  onChange,
  onCommit,
  slotProps,
  ...props
}: Omit<TextFieldProps, "value" | "onChange" | "onBlur" | "type"> & {
  value: number;
  onChange: (value: number | undefined) => void;
  onCommit?: (start: number) => void;
}) {
  const [text, setText] = useState<string>();
  const start = useRef<number>(undefined);
  const commit = () => {
    if (start.current === undefined) return;
    onCommit?.(start.current);
    start.current = undefined;
  };
  // Escape closes the dialog without blurring the field first
  const commitOnUnmount = useEffectEvent(commit);
  useEffect(() => () => commitOnUnmount(), []);

  return (
    <TextField
      {...props}
      type="number"
      value={text ?? value}
      onChange={event => {
        start.current ??= value;
        setText(event.target.value);
        onChange(
          event.target.value === "" ? undefined : Number(event.target.value),
        );
      }}
      onBlur={() => {
        setText(undefined);
        commit();
      }}
      slotProps={{
        ...slotProps,
        htmlInput: { ...verbatim("number"), ...slotProps?.htmlInput },
      }}
    />
  );
}
