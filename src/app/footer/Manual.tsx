import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type TypeRow = [string, string, string];
type TermRow = [string, string];

const rowsOfTypeEffectivness: TypeRow[] = [
  ["No effect", "+1.5", "success.main"],
  ["0.25x effective", "+1.5", "success.main"],
  ["0.5x effective", "+1", "success.main"],
  ["1x effective", "0", "text.primary"],
  ["2x super effective", "-1", "error.main"],
  ["4x super effective", "-1.5", "error.main"],
];

const rowsOfTerms: TermRow[] = [
  ["Defogger", "A pokemon that knows Defog (which blows away entry hazards)."],
  [
    "Reliable Recovery",
    "Moves that are guaranteed to recover 50% or more of your HP every time you use it (under normal weather conditions). E.g. Recover, Softboiled, Milk Drink, Slack Off, Synthesis.",
  ],
  [
    "Status Moves",
    "Here, they refer to accurate moves that paralyze, burn, or poison, as well as moves that cause sleep. E.g. Toxic, Will-O-Wisp, Thunder Wave, Sing.",
  ],
  [
    "Boosting Move",
    "Moves that increase your stats (preferrably by 2+), like Swords Dance and Calm Mind.",
  ],
  [
    "Choice Item",
    "An item that increases a stat by 50% but locks you into one move. There are three of these items: Choice Band, Choice Specs, and Choice Scarf.",
  ],
];

export default function Manual() {
  return (
    <>
      <Typography variant="h6">Teams</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        Where are my teams saved?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Your teams are saved in this browser, so they are here when you come
        back, but not on another device. The Teams button lists them, and each
        team's menu renames it, sets its generation and format, duplicates it,
        shares it, or deletes it. Export All downloads every team as Showdown
        text, which Import Team reads back. The address bar always holds the
        current team, so copying the address (or pressing Share Team) shares it.
      </Typography>
      <Typography sx={{ mb: 2 }}>
        On phones and tablets, the More button shows the team tools, the Filters
        and Sort buttons, and the Advanced button. The undo and redo buttons at
        the bottom step through the current team's changes.
      </Typography>
      <Typography variant="h6">Generations</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        What does the generation change?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The generation, chosen at the top, lists only the pokemon and formes
        that existed in it: megas in Gens 6, 7, and 9, Gigantamax formes in Gen
        8, and so on. Everything else stays current: the moves, abilities, type
        chart, and formats come from the newest games, so an old generation's
        team may know moves it could not learn back then.
      </Typography>
      <Typography variant="h6">Advanced Options</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        Nicknames, levels, natures, EVs, and IVs
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Each pokemon's Advanced button sets its nickname, level, gender, shiny,
        tera type, nature, EVs, and IVs, in the same way as Pokemon Showdown.
        They travel with the team in share links and in the Copy text and Edit
        Pokepaste text, and the Name and Format dialog's check reports EVs over
        510, repeated moves, banned pokemon, and clauses.
      </Typography>
      <Typography variant="h6">Matrix Analysis</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        Where do the type scores come from?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The matrix, in the analysis panel's menu, shows every type against every
        pokemon. Defence is how hard each attacking type hits each pokemon, with
        its ability and item counted, and Coverage is how hard each pokemon's
        best damaging move hits each type. Tap a cell for the reason.
      </Typography>
      <Typography variant="h6">Team Defence</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        How is your team's type defence calculated?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Every pokemon in your team is weak to certain types and resistant to
        other types. If a type is not very effective against one of your
        pokemon, you gain points. But if it's super effective, you lose points:
      </Typography>
      <Table sx={{ mb: 2.5 }}>
        <TableHead>
          <TableRow>
            <TableCell>Type Effectiveness Against You</TableCell>
            <TableCell align="right">Points</TableCell>
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
        <strong>Note:</strong> Abilities like Levitate, Thick Fat, Filter, and
        Sap Sipper are taken into account. For example, if your Bronzong has
        Levitate, you get +1.5 for Ground. And if it has Heatproof, you get 0
        for Fire instead.
      </Typography>

      <Typography variant="h6">Team Type Coverage</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        How is your team's type coverage calculated?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        First, what is type coverage? It's about how many types your moves are
        super effective against. If one of your moves is super effective against
        a type, you gain +1. If that move also has the same type as the pokemon
        using it (STAB), then you gain another +1.
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <strong>Note:</strong> Abilities like Aerilate and Pixilate are taken
        into account. So are moves like Freeze Dry and Flying Press. For
        example, Freeze Dry also gives you +1 against Water.
      </Typography>
      <Typography variant="h6">Formats (aka Tiers)</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        What is Ubers, OU, VGC, etc.?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Ubers, OU, and{" "}
        <Link href="https://play.pokemon.com/en-us/resources/rules/?category=vgc">
          VGC
        </Link>{" "}
        are formats (or tiers) that ban some pokemon and enforce certain rules.
        Battle Stadium Singles/Doubles and VGC are the only ones endorsed by The
        Pokemon Company, while the other ones are maintained by{" "}
        <Link href="https://www.smogon.com/">Smogon</Link>. You can check out{" "}
        <Link href="https://www.smogon.com/ingame/battle/tiering-faq">
          Smogon's FAQ about tiers
        </Link>{" "}
        or{" "}
        <Link href="https://en.softonic.com/articles/competitive-pokemon-smogon">
          this guide that gives a brief description about each tier
        </Link>
        .
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The Pokemon Champions (M-C) format only lists the pokemon you can use in
        Pokemon Champions under Regulation M-C, including their mega evolutions.
      </Typography>
      <Typography variant="h6">Team Checklist Terms</Typography>
      <Typography variant="subtitle2" component="h4" gutterBottom>
        What do things like entry hazard, phazer, and volt-turn even mean?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Smogon has a{" "}
        <Link href="https://www.smogon.com/dp/articles/pokemon_dictionary">
          dictionary for pokemon terms
        </Link>
        , but it's a bit outdated. Here are some of the terms it doesn't cover:
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Term</TableCell>
            <TableCell sx={{ px: 0.5 }}>Definition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsOfTerms.map(row => (
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
