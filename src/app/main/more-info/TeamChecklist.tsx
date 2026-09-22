import Grid from "@mui/material/Grid";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import type { ChecklistItem } from "@/store/checklist";

const TeamChecklist = observer(function TeamChecklist() {
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();

  const labelFor = ({
    label,
    abbr,
    shortAbbr,
  }: Omit<ChecklistItem, "check">) =>
    isMdDown ? (shortAbbr ?? abbr ?? label)
    : isLgDown ? (abbr ?? label)
    : label;

  return store.checklist.map(({ title, items }) => (
    <Grid key={title} size={4} sx={{ p: 1 }}>
      {/* E.g. Offensive */}
      <Typography
        sx={{ fontWeight: "bold", pb: 1 }}
        component="h3"
        style={{ lineHeight: "initial" }}
      >
        {title}
      </Typography>
      {items.map(item => (
        <div key={item.label} style={{ display: "flex" }}>
          {/* Either a checkmark or a cross */}
          <div>
            {item.isChecked ?
              <CheckCircle style={{ color: "#16a085" }} />
            : <Typography component="div" style={{ lineHeight: "initial" }}>
                <Cancel />
              </Typography>
            }
          </div>
          {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
          <Typography sx={{ px: 0.5 }} component="div">
            {labelFor(item)}
          </Typography>
        </div>
      ))}
    </Grid>
  ));
});

export default TeamChecklist;
