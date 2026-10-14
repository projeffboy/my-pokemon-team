# 11. Analysis of Existing Systems

Requirement level: business and user. The goal of analysing existing systems is to understand which features competing products offer and how well those features work, so that the features of My Pokemon Team are chosen with the alternatives in view. This document follows the course's report on an existing system: a description of each product, a table of features with an assessment, and a discussion.

The old website is also an existing system. It is not analysed here, because its features are the "R0 Old website" configuration of the [feature model](04-feature-model.md).

## 11.1 How the products were examined

Six products were examined on 13 October 2026 by loading each one in a browser and using it: adding one or two pokemon, opening its analysis, and reading the page. Nobody signed in, and no product was used at length. Each finding below carries one of four labels:

- **Observed**: seen or operated on the product's own page.
- **Stated**: the product's own page says so, but the feature was not operated.
- **Inferred**: concluded from what was seen, without direct evidence.
- **Not verified**: could not be established.

Limits of this analysis:

- One short session per product. A feature that was not found may still exist.
- Popularity was not measured. As a check, the first page of a Google search for "pokemon teambuilder" (13 October 2026, English, United States) listed, in order: richi3f, My Pokemon Team, Pokemon Showdown, Marriland, pokemon-team-builder.org, PokéBase, PokeSynergy, Pokéos, and Pokemon Zone. Four of the six products examined are on that page. Pikalytics and PKMN.help are not, and four products on it were not examined: pokemon-team-builder.org, PokéBase, Pokéos, and Pokemon Zone. Search results vary by place and person.
- Phone use was checked only as "no sideways scrolling at a width of 375 pixels" on the first screen.
- Whether held items change a product's defensive totals was not tested in any of them.
- Three further Pokemon Champions tools appeared in search and were not examined: PokeTools, ChampTeams, and Champions Lab.
- Pokemon Database was a candidate and was dropped: its tools page offers a type coverage calculator that takes attack types only, and no team planner.

## 11.2 The products

**Pokemon Showdown teambuilder** (Smogon and the Pokemon Showdown project, `play.pokemonshowdown.com/teambuilder`). The set editor of the battle simulator. Players build format-legal competitive sets in it and battle with them in the same application. It validates a team against a format, keeps teams in the browser or in an account, and backs them all up. It has no team-level type analysis of any kind (observed).

**Marriland Team Builder** (Marriland, a fan site, `marriland.com/tools/team-builder/`). A weakness and resistance table for up to six pokemon, for Generations 1 to 9 and Legends: Z-A. Each pokemon is a column and each type a row, with totals. Abilities change the result: Bronzong's Ground cell went from 2x to immune with Levitate, and Heatran's Fire cell showed immune with Flash Fire (both observed). The two tests found no inaccuracy; a wider test of its accuracy was not made. An "Advanced Mode" checks the team's moves against up to six opposing pokemon the player enters (stated). It has no set details beyond a tera or custom type, and no Showdown text.

**richi3f Pokemon Team Planner** (richi3f, open source, `richi3f.github.io/pokemon-team-planner/`). The player picks a game from twenty-two, including spin-offs, Legends: Z-A, and Pokemon Champions, and then picks six pokemon from that game's own list. It tallies type weaknesses per slot. It is meant for planning an in-game run. By its own FAQ, abilities are not factored in and coverage uses the pokemon's types, not its moves (observed). The whole team is in the page's address.

**Pikalytics Team Builder** (Pikalytics, a usage statistics site, `pikalytics.com/team`). A competitive builder that fills each pokemon with its most used set for the chosen format, then shows weak, resist, and immune counts per type and counts of super effective and same-type moves. Abilities change the counts (observed with Rotom-Wash). It adds damage, speed, and matchup tools, a share link, a share image, and Showdown import and export. Its usage data said "last updated May 2026".

**PKMN.help** (Sage Fennel Mock, open source, `pkmn.help`). A type calculator, not a team builder. A team member is entered as a type combination with one ability and a tera type, with no pokemon, moves, or items. Its "Team defense" page counts matchups by multiplier, and twenty-six abilities change them (observed with Levitate). It is offered in twenty languages and states that it will never run advertisements.

**PokeSynergy** (Scoriox, `pokesynergy.app`). A Pokemon Champions builder aimed at the current ranked format, with data dated 26 September 2026. It counts defensive matchups per type, audits super effective coverage from the team's moves, and suggests what would close a gap: "Suggested types: Steel, covers 4: Bug, Flying, Ice, Poison" (observed). It adds an automatic team builder, threat analysis against commonly used teams, a damage calculator, and an optional account.

## 11.3 Features and assessment

The assessment says what My Pokemon Team should do about a feature, in the course's three terms: **must have as is** (keep or adopt it as the products do it), **must have with improvements** (have it, done better than the products do), or **can be dropped** (the site does not need it). A dropped feature is not part of the plan; none is ruled out for good.

Products: PS Pokemon Showdown, MA Marriland, RI richi3f, PI Pikalytics, PH PKMN.help, SY PokeSynergy.

| Feature                                 | What the products do                                                                                                                                        | Seen in                                 | My Pokemon Team today                                                        | Assessment                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| Moves, item, and ability per pokemon    | A full set per slot in the competitive builders; a pokemon alone, or a type combination, in the planners.                                                   | PS, PI, SY; partly MA                   | Has it (F1.1)                                                                | Must have as is             |
| Set details                             | Nature, training values, level, tera type. Only Showdown has all of them.                                                                                   | PS; partly PI, SY, MA, PH               | Has it (F1.2)                                                                | Must have as is             |
| Defensive totals per type               | Counts of weak, resistant, and immune members per type. Showdown has none.                                                                                  | MA, RI, PI, PH, SY                      | Has it, as a score (F4.1)                                                    | Must have as is             |
| Abilities change the totals             | Levitate turned a Ground weakness into an immunity in all four products where it was tested. richi3f says it ignores abilities.                             | MA, PI, PH, SY                          | Has it                                                                       | Must have as is             |
| Held items change the totals            | Not verified in any product.                                                                                                                                | Not verified                            | Has it                                                                       | Must have as is             |
| Coverage from the team's own moves      | Counts of super effective moves per type. Marriland checks moves against opponents the player enters; PKMN.help needs attack types typed in.                | PI, SY; partly MA, PH                   | Has it (F4.2), with special moves such as Freeze-Dry                         | Must have as is             |
| Explanation of a score                  | A legend or help text at most. None says which pokemon and which move or ability produced a number.                                                         | Partly RI, SY                           | Has it (F4.3)                                                                | Must have as is             |
| Type against each team member           | A table with one column or cell per member.                                                                                                                 | MA, RI                                  | Has it (F4.5)                                                                | Must have as is             |
| Checklist of competitive roles          | None has one. Showdown links to Smogon's role pages; PokeSynergy tags one role on each pokemon.                                                             | None; partly SY                         | Has it (F4.4)                                                                | Must have with improvements |
| Search filters                          | richi3f filters by type, excluded type, evolution, version, colour, and more. PokeSynergy searches by type, move, or ability.                               | RI, SY; partly PS, MA, PI               | Has format, type, region, ability, viable moves (F3.2)                       | Must have with improvements |
| Games and generations                   | richi3f lists twenty-two games, each with its own pokemon list, including spin-offs. Showdown and Pikalytics organize by format.                            | All; SY is Champions only               | Generations 1 to 9, the combined pool, Champions (F2.1)                      | Must have with improvements |
| Moving a team between generations       | None offers it.                                                                                                                                             | None                                    | Has it, with a preview of what is lost (F2.2)                                | Must have as is             |
| Saved teams                             | In the browser for most. Showdown and PokeSynergy also offer an account that saves across devices. richi3f saves nothing.                                   | PS, MA, PI, SY; one team in PH          | Has it, in the browser (F5.1)                                                | Must have as is             |
| Backup of all teams                     | Showdown has "Backup/Restore all teams". Not verified elsewhere.                                                                                            | PS                                      | Has it, through Export All and Import Team (F6)                              | Must have as is             |
| Share link                              | Marriland gives a short link and a team code. richi3f keeps the team in the address. Showdown uploads to PokePaste. Pikalytics also shares an image.        | MA, RI, PI, PH; partly PS               | Has it; the address holds the team, so the link is long (F6)                 | Must have with improvements |
| Showdown text import and export         | The competitive builders have it; the planners do not.                                                                                                      | PS, PI, SY                              | Has it (F6)                                                                  | Must have as is             |
| Legality validation                     | Showdown validates against a format on request. Others only limit the pokemon offered.                                                                      | PS; partly MA, RI, PI, SY               | Computed but not shown; planned as PF6                                       | Must have with improvements |
| Suggestions to close a gap              | PokeSynergy names a type that would cover the team's weaknesses and what it covers. Pikalytics suggests commonly used partners.                             | SY; partly PI                           | Does not have it; open for a later release                                   | Must have with improvements |
| Check against an opposing team          | Marriland checks moves against six entered opponents; PokeSynergy analyses threats from commonly used teams.                                                | MA, SY                                  | Does not have it                                                             | Can be dropped              |
| Sets filled in from usage data          | Pikalytics adds a pokemon with its most used item, ability, and moves.                                                                                      | PI, SY                                  | Fills only a required item or sole ability; random sets on request           | Can be dropped              |
| Damage calculator, speed tiers, battles | Part of the same product in the competitive builders.                                                                                                       | PS, PI, SY                              | Not part of the plan                                                         | Can be dropped              |
| Account and saving across devices       | Optional sign-in.                                                                                                                                           | PS, SY                                  | Not part of the plan; Export All and Import Team move teams as Showdown text | Can be dropped              |
| Custom and overridden types             | Marriland lets a pokemon's type be overridden; PKMN.help allows three types and inverse battles.                                                            | MA, PH                                  | Does not have it                                                             | Can be dropped              |
| Languages                               | Twenty in PKMN.help, thirteen in Showdown, ten in Marriland, nine in Pikalytics, English only in richi3f and PokeSynergy.                                   | PH, PS, MA, PI                          | Ten (F8.1)                                                                   | Must have as is             |
| Phone layout                            | All fit a 375 pixel width on their first screen; Showdown's set editor was not tested.                                                                      | All; partly PS                          | Has it, from 320 pixels (F8.3)                                               | Must have as is             |
| Price and advertising                   | All are free. Showdown, Marriland, and Pikalytics show advertisements; Marriland's page names the same ad platform this site uses. PKMN.help promises none. | PS, MA, PI with ads; RI, PH, SY without | Free, with advertisements (F11)                                              | Must have as is             |

## 11.4 Discussion

### What sets My Pokemon Team apart

Three features were found in no product examined:

- **A checklist of competitive roles for the team.** The nearest thing is a link out to Smogon's role pages, or one role tag per pokemon.
- **An explanation of each score.** Every product shows counts or multipliers; none says which pokemon, move, or ability a number comes from.
- **Moving a team between generations with a preview of what is lost.**

A fourth distinction is a combination, not a single feature. The products split into two groups. The planners (Marriland, richi3f, PKMN.help) analyse types but hold no full sets and read no Showdown text. The competitive builders (Showdown, Pikalytics, PokeSynergy) hold full sets and Showdown text but give thinner type analysis, or none. My Pokemon Team is the only one with full sets, Showdown text, a per-member matrix, move-based coverage, and saved teams together, across Generations 1 to 9.

### What the first draft of these documents got wrong

The vision statement first said that, unlike type-only planners and Showdown's teambuilder, this site counts abilities. That was an assumption (A-1), and it was too broad. Marriland, Pikalytics, PKMN.help, and PokeSynergy all count abilities; only richi3f does not, and it says so. Counting abilities is now what a player expects from any planner. It is a requirement to keep, not a reason to choose this site. The business opportunity, the problem statement, and the vision statement in [01-vision-and-scope.md](01-vision-and-scope.md) were corrected to rest on the distinctions above. Whether any competitor counts held items was not verified, so the documents no longer claim that either way.

### Where the products are ahead

- **Legality validation.** Showdown checks a team against its format. The site computes the same kind of rules and shows nothing, which is the planned feature PF6. It can be done better than Showdown's does it, by showing the problems as the team is built, without a separate request (mock-up M3).
- **Suggestions.** PokeSynergy's suggestion names what it covers, which makes it an explanation as well as advice. The Site Owner left suggestions open for a later release, and this is the strongest evidence that players are offered them elsewhere. A version for this site could be more modest and still fit its character: say which types would close the team's worst gaps, and let the type filter show the pokemon.
- **Per-game pokemon lists.** richi3f's twenty-two games, with filters for version exclusives and evolutions, serve the in-game player (persona P-1) better than a generation does. The planned games (PF3) go part of the way.
- **Search filters.** richi3f can exclude a type; PokeSynergy searches by move. The site's Moves filter only limits the moves offered and does not find pokemon by a move they learn, although the project's README describes it as narrowing the pokemon.
- **Share links.** Marriland's link is short. This site's link holds the whole team, which keeps it working with no server and makes it long. A share image, as Pikalytics has, would suit the places teams are posted.
- **Languages and advertising.** PKMN.help has twice the languages and no advertisements. The site's advertising is how it pays for itself (BR-1), so this is a difference to be aware of, not one to close.

### What does not need to be matched

Damage calculation, speed tiers, battles, and accounts are what the competitive builders are built around. They are not part of the plan for this site, and the analysis gives no reason to change that: the three products that have them are the ones with the thinnest type analysis. Checking against an opposing team and filling sets from usage data depend on usage statistics the site does not have. Custom types and inverse battles serve a small audience.

### Candidates for the Site Owner

Nothing below is a requirement. Each is a feature a competitor has, that the site lacks, and that fits what the site is for. They are listed for a decision, and none has been added to the feature model or the GitHub issues.

| Candidate                                       | Seen in | Fits which goal                                |
| ----------------------------------------------- | ------- | ---------------------------------------------- |
| Name the types that would close the team's gaps | SY      | PL1 Know my team's weaknesses                  |
| Find pokemon by a move they learn               | SY      | PL3 Find suitable pokemon quickly              |
| Exclude a type in the filters                   | RI      | PL3 Find suitable pokemon quickly              |
| Share the team as an image                      | PI      | PL5 Move teams between tools and people        |
| Upload the team to PokePaste                    | PS, PI  | PL5 Move teams between tools and people        |
| A shorter share link                            | MA      | PL5; conflicts with BR-6, as it needs a server |

## 11.5 Sources

All visited on 13 October 2026.

- Pokemon Showdown teambuilder: `https://play.pokemonshowdown.com/teambuilder`
- Marriland Team Builder: `https://marriland.com/tools/team-builder/`
- richi3f Pokemon Team Planner: `https://richi3f.github.io/pokemon-team-planner/`
- Pikalytics Team Builder: `https://www.pikalytics.com/team`
- PKMN.help: `https://www.pkmn.help/`
- PokeSynergy: `https://pokesynergy.app/`, `https://pokesynergy.app/terms`, `https://pokesynergy.app/vs/pikalytics`
- Pokemon Database tools: `https://pokemondb.net/tools`, `https://pokemondb.net/tools/type-coverage`
