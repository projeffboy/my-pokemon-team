import Button, { type ButtonProps } from "@mui/material/Button";

// A footer link in the body font rather than MUI's bold uppercase button text
export default function FooterButton(props: ButtonProps) {
  return (
    <Button
      sx={{ fontWeight: "initial", textTransform: "initial" }}
      {...props}
    />
  );
}
