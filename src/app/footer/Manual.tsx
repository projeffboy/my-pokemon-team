import { useId, type ReactNode } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";

// A question that opens to its answer, so the manual reads as a list of questions
function Question({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        bgcolor: "transparent",
        borderBottom: 1,
        borderColor: "divider",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={`${id}-question`}
        aria-controls={`${id}-answer`}
        sx={{ px: 0 }}
      >
        {/* The summary is already in an h3 */}
        <Typography component="span" sx={{ fontWeight: "medium" }}>
          {question}
        </Typography>
      </AccordionSummary>
      {/* The accordion gives its region the id that aria-controls names */}
      <AccordionDetails
        sx={{ px: 0, pt: 0, "& > p:not(:last-child)": { mb: 2 } }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export default function Manual() {
  const { t } = useTranslation();
  const { manual } = t;
  const { effectiveness } = manual;
  const rowsOfTypeEffectivness: [string, string, string][] = [
    [effectiveness.immune, "+1.5", "success.main"],
    [effectiveness.quarter, "+1.5", "success.main"],
    [effectiveness.half, "+1", "success.main"],
    [effectiveness.neutral, "0", "text.primary"],
    [effectiveness.double, "-1", "error.main"],
    [effectiveness.quadruple, "-1.5", "error.main"],
  ];

  return (
    <>
      <Question question={manual.teamsQuestion}>
        <Typography>{manual.teamsAnswer}</Typography>
      </Question>
      <Question question={manual.formatsQuestion}>
        <Typography>
          {fill(manual.formatsAnswer, {
            vgc: (
              <Link href="https://play.pokemon.com/en-us/resources/rules/?category=vgc">
                {manual.vgc}
              </Link>
            ),
            smogon: <Link href="https://www.smogon.com/">{manual.smogon}</Link>,
            faq: (
              <Link href="https://www.smogon.com/ingame/battle/tiering-faq">
                {manual.faq}
              </Link>
            ),
            guide: (
              <Link href="https://en.softonic.com/articles/competitive-pokemon-smogon">
                {manual.guide}
              </Link>
            ),
          })}
        </Typography>
        <Typography>{manual.champions}</Typography>
      </Question>
      <Question question={manual.termsQuestion}>
        <Typography sx={{ mb: 1 }}>
          {fill(manual.termsAnswer, {
            dictionary: (
              <Link href="https://www.smogon.com/dp/articles/pokemon_dictionary">
                {manual.dictionary}
              </Link>
            ),
          })}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>{manual.termHeading}</TableCell>
              <TableCell sx={{ pr: 0 }}>{manual.definitionHeading}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manual.definitions.map(row => (
              <TableRow key={row[0]}>
                <TableCell component="th" scope="row" sx={{ pl: 0 }}>
                  {row[0]}
                </TableCell>
                <TableCell sx={{ pr: 0 }}>{row[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Question>
      <Question question={manual.defenceQuestion}>
        <Typography sx={{ mb: 1 }}>{manual.defenceAnswer}</Typography>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                {manual.effectivenessHeading}
              </TableCell>
              <TableCell align="right" sx={{ pr: 0 }}>
                {manual.pointsHeading}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsOfTypeEffectivness.map(row => (
              <TableRow key={row[0]}>
                <TableCell component="th" scope="row" sx={{ pl: 0 }}>
                  {row[0]}
                </TableCell>
                <TableCell align="right" sx={{ color: row[2], pr: 0 }}>
                  {row[1]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography>
          <strong>{manual.note}</strong> {manual.defenceNote}
        </Typography>
      </Question>
      <Question question={manual.coverageQuestion}>
        <Typography>{manual.coverageAnswer}</Typography>
        <Typography>
          <strong>{manual.note}</strong> {manual.coverageNote}
        </Typography>
      </Question>
      <Question question={manual.matrixQuestion}>
        <Typography>{manual.matrixAnswer}</Typography>
      </Question>
      <Question question={manual.generationsQuestion}>
        <Typography>{manual.generationsAnswer}</Typography>
      </Question>
    </>
  );
}
