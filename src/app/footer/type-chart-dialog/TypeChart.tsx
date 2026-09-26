import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TypeChartPng from "@/images/type-charts/type-chart.webp";
import TypeChartListPng from "@/images/type-charts/type-chart-list.webp";
import TypeChartInfographicPng from "@/images/type-charts/type-chart-infographic.webp";
import { useBreakpoint } from "@/app/shared/WidthContext";

const charts = [
  { label: "Table", alt: "Bulbapedia Pokemon Type Chart", src: TypeChartPng },
  {
    label: "List",
    alt: "List Pokemon Type Chart",
    src: TypeChartListPng,
    caption: "Strong against → Type → Strong against",
  },
  {
    label: "Infographic",
    alt: "Infographic Type Chart",
    src: TypeChartInfographicPng,
    caption: "Also applies for Gen 7-9",
  },
];

export default function TypeChart() {
  const width = useBreakpoint();
  const [value, setValue] = useState(() => (width === "xs" ? 1 : 0));
  const chart = charts[value];

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="inherit"
        >
          {charts.map(({ label }) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </AppBar>
      {chart && (
        <Typography component="div" sx={{ p: 3 }}>
          {chart.caption && (
            <Typography
              variant={width === "xs" ? "caption" : "h5"}
              sx={{ pb: 2.5, textAlign: "center" }}
            >
              {chart.caption}
            </Typography>
          )}
          <Box
            component="img"
            alt={chart.alt}
            src={chart.src}
            sx={{ maxWidth: "100%" }}
          />
        </Typography>
      )}
    </>
  );
}
