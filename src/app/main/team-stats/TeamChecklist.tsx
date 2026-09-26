import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { checklistLabel } from "@/store/checklist";

const TeamChecklist = observer(function TeamChecklist() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();

  return (
    <Grid container>
      {store.checklist.map(({ key, items }) => (
        <Grid key={key} size={4} sx={{ p: 1 }}>
          {/* E.g. Offensive */}
          <Typography
            sx={{ fontWeight: "bold", pb: 1, lineHeight: "initial" }}
            component="h4"
          >
            {t.checklist.groups[key]}
          </Typography>
          {items.map(item => (
            <Box key={item.key} sx={{ display: "flex" }}>
              {/* Either a checkmark or a cross */}
              <div>
                {item.isChecked ?
                  <CheckCircle color="success" titleAccess={t.stats.checked} />
                : <Typography component="div" sx={{ lineHeight: "initial" }}>
                    <Cancel titleAccess={t.stats.unchecked} />
                  </Typography>
                }
              </div>
              {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
              <Typography sx={{ px: 0.5 }} component="div">
                {checklistLabel(t.checklist.items[item.key], {
                  isMdDown,
                  isLgDown,
                })}
              </Typography>
            </Box>
          ))}
        </Grid>
      ))}
    </Grid>
  );
});

export default TeamChecklist;
