import { useLayoutEffect, useRef, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/app/shared/TranslationContext";

export default function HiddenAbilityLabel({ ability }: { ability: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLSpanElement>(null);
  const [fits, setFits] = useState(false);

  useLayoutEffect(() => {
    const label = ref.current;
    const adornment = label?.parentElement;
    const field = adornment?.parentElement;
    const input = field?.querySelector("input");
    const context = document.createElement("canvas").getContext("2d");
    if (!label || !adornment || !field || !input || !context) return;
    const measureText = (text: string, element: HTMLElement) => {
      const style = getComputedStyle(element);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      return (
        context.measureText(text).width +
        text.length * (parseFloat(style.letterSpacing) || 0)
      );
    };
    const measure = () => {
      const fieldStyle = getComputedStyle(field);
      const inputStyle = getComputedStyle(input);
      const adornmentStyle = getComputedStyle(adornment);
      const spacing =
        parseFloat(fieldStyle.paddingLeft) +
        parseFloat(fieldStyle.paddingRight) +
        parseFloat(inputStyle.paddingLeft) +
        parseFloat(inputStyle.paddingRight) +
        parseFloat(adornmentStyle.marginLeft) +
        parseFloat(adornmentStyle.marginRight);
      setFits(
        Math.ceil(
          measureText(ability, input) + measureText(t.team.hidden, label),
        ) +
          spacing <=
          field.clientWidth,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [ability, t.team.hidden]);

  return (
    <InputAdornment
      position="end"
      sx={{ display: fits ? "inline-flex" : "none", ml: 1, mr: 7 }}
    >
      <Typography
        component="span"
        variant="caption"
        ref={ref}
        sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
      >
        {t.team.hidden}
      </Typography>
    </InputAdornment>
  );
}
