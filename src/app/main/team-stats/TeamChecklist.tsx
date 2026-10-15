import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Help from "@mui/icons-material/Help";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { checklistLabel, type ChecklistItemKey } from "@/store/checklist";
import type { BattleFormat } from "@/types";

const NOT_SET = "notSet";

const TeamChecklist = observer(function TeamChecklist() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();
  const { battleFormat } = t.checklist;
  const reasons: Partial<Record<ChecklistItemKey, string>> =
    battleFormat.reasons;
  const depending = store.checklist
    .flatMap(group => group.items)
    .filter(item => item.dependsOnBattleFormat);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={store.currentTeam.battleFormat ?? NOT_SET}
          onChange={(_event, value: BattleFormat | typeof NOT_SET | null) => {
            if (value === NOT_SET) delete store.currentTeam.battleFormat;
            else if (value) store.currentTeam.battleFormat = value;
          }}
          aria-label={battleFormat.label}
        >
          <ToggleButton value="singles">{battleFormat.singles}</ToggleButton>
          <ToggleButton value="doubles">{battleFormat.doubles}</ToggleButton>
          <ToggleButton value={NOT_SET}>{battleFormat.notSet}</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid container>
        {store.checklist.map(({ key, items }) => (
          <Grid key={key} size={4} sx={{ px: { xxs: 0.5, md: 1 }, py: 1 }}>
            {/* E.g. Offensive */}
            <Typography
              sx={{ fontWeight: "bold", pb: 1, lineHeight: "initial" }}
              component="h4"
            >
              {t.checklist.groups[key]}
            </Typography>
            {items.map(item => (
              <Box key={item.key} sx={{ display: "flex" }}>
                {/* A checkmark, a cross, or a question mark when it depends on the battle format */}
                <div>
                  {item.dependsOnBattleFormat ?
                    <Help color="info" titleAccess={battleFormat.depends} />
                  : item.isChecked ?
                    <CheckCircle
                      color="success"
                      titleAccess={t.stats.checked}
                    />
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
      {depending.map(({ key }) => (
        <Typography
          key={key}
          variant="body2"
          sx={{ color: "text.secondary", px: { xxs: 0.5, md: 1 }, pb: 1 }}
        >
          {reasons[key]}
        </Typography>
      ))}
    </>
  );
});

export default TeamChecklist;
