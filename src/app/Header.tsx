import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import garchompFace from "@/images/pokemon-shuffle-faces/garchomp-shuffle-face-cropped.svg";
import jigglypuffFace from "@/images/pokemon-shuffle-faces/jigglypuff-shuffle-face-cropped.svg";
import { fluidClamp } from "./header/fluid-clamp";
import GenerationSelect from "./header/GenerationSelect";
import LanguageSelect from "./header/LanguageSelect";
import FeedbackDialog from "./header/FeedbackDialog";
import { breakpointValues } from "./shared/theme";
import { useTranslation } from "./shared/TranslationContext";

// Where the title reaches its full size: the page's margins widen at sm,
// so the title needs a little more width than that to fit
const fullSizeWidth = breakpointValues.sm + 40;
const minimumTitleWidth = 300;
const fluid = (min: number, max: number, unit?: "px" | "rem") =>
  fluidClamp(min, max, minimumTitleWidth, fullSizeWidth, unit);
const faceHeight = fluid(31, 48);
const faceSpacing = fluid(3.75, 8);

export default function Header() {
  const { t } = useTranslation();
  return (
    <Grid component="header" container size={12} spacing={1.5}>
      <Stack
        spacing={1.5}
        sx={{ width: "max-content", maxWidth: "100%", mx: "auto" }}
      >
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: faceSpacing,
          }}
        >
          <Box
            component="img"
            src={garchompFace}
            alt=""
            sx={{
              height: faceHeight,
              flexShrink: 0,
            }}
          />
          <Badge
            badgeContent={t.beta}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              pt: 2,
              "& .MuiBadge-badge": {
                top: 0,
                right: fluid(1.125, 16),
                transform: "none",
                height: 16,
                fontSize: "0.625rem",
                whiteSpace: "nowrap",
              },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={theme => ({
                whiteSpace: "nowrap",
                flexShrink: 0,
                px: fluid(1.125, 16),
                fontSize: fluid(
                  1.3,
                  Number.parseFloat(`${theme.typography.h3.fontSize}`),
                  "rem",
                ),
              })}
            >
              My Pokemon Team
            </Typography>
          </Badge>
          <Box
            component="img"
            src={jigglypuffFace}
            alt=""
            sx={{
              height: faceHeight,
              flexShrink: 0,
            }}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            maxWidth: "100%",
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <LanguageSelect />
          <GenerationSelect />
          <FeedbackDialog />
        </Stack>
      </Stack>
    </Grid>
  );
}
