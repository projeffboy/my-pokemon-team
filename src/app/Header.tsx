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
import SiteVersionSwitch from "./header/SiteVersionSwitch";
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
      <Stack spacing={1.5} useFlexGap sx={{ width: "100%", maxWidth: "100%" }}>
        <Stack
          direction="row"
          sx={{
            width: "max-content",
            maxWidth: "100%",
            mx: "auto",
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
              "& .MuiBadge-badge": {
                top: 4,
                right: fluid(1.125, 16),
                transform: "translateY(-100%)",
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
        <Box
          sx={{
            display: "grid",
            width: "max-content",
            maxWidth: "100%",
            mx: "auto",
            gridTemplateColumns: {
              xxs: "auto auto",
              sm: "minmax(0, auto) minmax(240px, 1fr) auto",
              md: "auto minmax(0, 1fr) auto",
            },
            alignItems: "center",
            gap: 1,
            rowGap: { xxs: 2, sm: 1 },
          }}
        >
          <Box
            sx={{
              justifySelf: { xxs: "end", sm: "start" },
              minWidth: { sm: 0, md: "auto" },
              maxWidth: { sm: "100%", md: "none" },
            }}
          >
            <SiteVersionSwitch />
          </Box>
          <Box
            sx={{
              gridColumn: { xxs: "1 / -1", sm: 2 },
              gridRow: { xxs: 2, sm: 1 },
              justifySelf: "center",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <GenerationSelect />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              gridColumn: { xxs: 2, sm: 3 },
              gridRow: 1,
              justifySelf: { xxs: "start", sm: "end" },
              alignItems: "stretch",
            }}
          >
            <LanguageSelect />
            <FeedbackDialog />
          </Stack>
        </Box>
      </Stack>
    </Grid>
  );
}
