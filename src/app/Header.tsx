import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { LOCALE_CODES, LOCALE_NAMES } from "@/i18n/locales";
import garchompFace from "@/images/pokemon-shuffle-faces/garchomp-shuffle-face-cropped.svg";
import jigglypuffFace from "@/images/pokemon-shuffle-faces/jigglypuff-shuffle-face-cropped.svg";
import { fluidClamp } from "./header/fluid-clamp";
import GenerationSelect from "./header/GenerationSelect";
import LanguageSelect from "./header/LanguageSelect";
import FeedbackDialog from "./header/FeedbackDialog";
import SiteVersionSwitch from "./header/SiteVersionSwitch";
import { breakpointValues } from "./shared/theme";
import { useTranslation } from "./shared/TranslationContext";
import useFittingLabel from "./shared/use-fitting-label";

// Where the title reaches its full size: the page's margins widen at sm,
// so the title needs a little more width than that to fit
const fullSizeWidth = breakpointValues.sm + 40;
const minimumTitleWidth = 300;
const fluid = (min: number, max: number, unit?: "px" | "rem") =>
  fluidClamp(min, max, minimumTitleWidth, fullSizeWidth, unit);
const faceHeight = fluid(31, 48);
const faceSpacing = fluid(3.75, 8);
// With its icon beside the caption, a caption button is this much wider than its text
const rowButtonExtra = 56;
// What the generation keeps before the caption buttons take a row: enough for most game names
const rowGenerationWidth = 240;

const Header = observer(function Header() {
  const { t } = useTranslation();
  // The probe is as wide as the room the two captions would have in a row. The row comes
  // first, with the language's code, and then its name.
  const named = LOCALE_NAMES[store.locale] + t.feedback.caption;
  const { ref: rowRoom, label: rowCaptions } = useFittingLabel<HTMLDivElement>([
    named,
    LOCALE_CODES[store.locale] + t.feedback.caption,
    "",
  ]);
  const row = !!rowCaptions;
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
            // The version switch takes what the other buttons leave, up to its full label.
            // On phones the outer columns centre that row above the generation.
            gridTemplateColumns: {
              xxs: "1fr minmax(0, auto) auto 1fr",
              sm: "minmax(0, auto) minmax(min-content, 1fr)",
            },
            alignItems: "center",
            columnGap: { xxs: 0, sm: 1 },
            rowGap: { xxs: 2, sm: 1 },
          }}
        >
          <Box sx={{ gridColumn: { xxs: 2, sm: 1 }, minWidth: 0 }}>
            <SiteVersionSwitch />
          </Box>
          {/* From sm up these share the second column, so the version switch gets its full
              label before the generation grows. 184px is the narrowest that fits
              "Gen 9 · Champions". */}
          <Box
            sx={{
              display: { xxs: "contents", sm: "grid" },
              position: "relative",
              gridTemplateColumns: "minmax(184px, 1fr) auto",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              ref={rowRoom}
              sx={{
                display: { xxs: "none", sm: "block" },
                position: "absolute",
                insetInline: 0,
                pr: `${rowGenerationWidth + 2 * (8 + rowButtonExtra)}px`,
                typography: "button",
              }}
            />
            <Box
              sx={{
                gridColumn: { xxs: "1 / -1", sm: 1 },
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
                gridColumn: { xxs: 3, sm: 2 },
                gridRow: 1,
                ml: { xxs: 1, sm: 0 },
              }}
            >
              <LanguageSelect row={row} named={rowCaptions === named} />
              <FeedbackDialog row={row} />
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Grid>
  );
});

export default Header;
