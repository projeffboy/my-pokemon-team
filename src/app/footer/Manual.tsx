import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";

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
      <Typography variant="h6">{manual.teams}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.teamsQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.teamsAnswer}</Typography>
      <Typography sx={{ mb: 2 }}>{manual.teamsAnswer2}</Typography>
      <Typography variant="h6">{manual.generations}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.generationsQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.generationsAnswer}</Typography>
      <Typography variant="h6">{manual.advanced}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.advancedQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.advancedAnswer}</Typography>
      <Typography variant="h6">{manual.matrix}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.matrixQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.matrixAnswer}</Typography>
      <Typography variant="h6">{manual.defence}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.defenceQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.defenceAnswer}</Typography>
      <Table sx={{ mb: 2.5 }}>
        <TableHead>
          <TableRow>
            <TableCell>{manual.effectivenessHeading}</TableCell>
            <TableCell align="right">{manual.pointsHeading}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsOfTypeEffectivness.map(row => (
            <TableRow key={row[0]}>
              <TableCell component="th" scope="row">
                {row[0]}
              </TableCell>
              <TableCell align="right" sx={{ color: row[2] }}>
                {row[1]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography sx={{ mb: 2 }}>
        <strong>{manual.note}</strong> {manual.defenceNote}
      </Typography>

      <Typography variant="h6">{manual.coverage}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.coverageQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>{manual.coverageAnswer}</Typography>
      <Typography sx={{ mb: 2 }}>
        <strong>{manual.note}</strong> {manual.coverageNote}
      </Typography>
      <Typography variant="h6">{manual.formats}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.formatsQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>
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
      <Typography sx={{ mb: 2 }}>{manual.champions}</Typography>
      <Typography variant="h6">{manual.terms}</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        {manual.termsQuestion}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {fill(manual.termsAnswer, {
          dictionary: (
            <Link href="https://www.smogon.com/dp/articles/pokemon_dictionary">
              {manual.dictionary}
            </Link>
          ),
        })}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{manual.termHeading}</TableCell>
            <TableCell sx={{ px: 0.5 }}>{manual.definitionHeading}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manual.definitions.map(row => (
            <TableRow key={row[0]}>
              <TableCell component="th" scope="row">
                {row[0]}
              </TableCell>
              <TableCell sx={{ px: 0.5 }}>{row[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
