import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import { checklistLabel } from "@/store/checklist";

const TeamChecklist = observer(function TeamChecklist() {
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();

  return store.checklist.map(({ title, items }) => (
    <Grid key={title} size={4} sx={{ p: 1 }}>
      {/* E.g. Offensive */}
      <Typography
        sx={{ fontWeight: "bold", pb: 1, lineHeight: "initial" }}
        component="h3"
      >
        {title}
      </Typography>
      {items.map(item => (
        <Box key={item.label} sx={{ display: "flex" }}>
          {/* Either a checkmark or a cross */}
          <div>
            {item.isChecked ?
              <CheckCircle color="success" titleAccess="Checked" />
            : <Typography component="div" sx={{ lineHeight: "initial" }}>
                <Cancel titleAccess="Unchecked" />
              </Typography>
            }
          </div>
          {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
          <Typography sx={{ px: 0.5 }} component="div">
            {checklistLabel(item, { isMdDown, isLgDown })}
          </Typography>
        </Box>
      ))}
    </Grid>
  ));
});

export default TeamChecklist;
