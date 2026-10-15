# 1. Vision and Scope

Why My Pokemon Team exists, what it has to achieve, and what it does and plans to do. Every requirement in the later documents should serve one of the business requirements here.

Statements marked **[A-n]** are assumptions the Site Owner has not confirmed yet. [08-assumptions-and-interview.md](08-assumptions-and-interview.md#82-open-questions) lists each one with the question that would settle it.

## 1.1 Why the site exists

Pokemon players, most of them not competitive, plan a team of six before they play: for a playthrough, a fan-made game, Pokemon Showdown, or official formats such as VGC and Pokemon Champions. The question is always which types hit the team hard, and which types the team hits hard. Answering it by hand means reading an 18 by 18 type chart for six pokemon and up to 24 moves, then allowing for the abilities, items, and moves that break the chart, such as Levitate, Thick Fat, and Freeze-Dry.

Competitive builders such as Pokemon Showdown's hold full sets and read Showdown's team text, but give little type analysis. Type planners total a team's weaknesses, but hold no full sets and read no team text. None of the six tools examined in [11-existing-systems-analysis.md](11-existing-systems-analysis.md) explains where its totals come from, checks a team against the roles a competitive team needs, or carries a team from one generation to another. My Pokemon Team does both jobs in one place and adds those three, for Generations 1 to 9 and Pokemon Champions, in ten languages.

The Site Owner made the site in 2019 because good teambuilders were lacking. It is free to use. Ads managed by Playwire are meant to pay for its hosting and for the time the owner spends on it.

## 1.2 Business requirements

| ID   | Business objective and how it is measured                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-1 | Advertising revenue shall cover the site's hosting, domain, and email costs in every calendar month, and shall pay the Site Owner for the hours spent building and maintaining the site at a rate the Site Owner sets **[A-2]**.                                                                                                                                                                                                              |
| BR-2 | Every share link and every saved team created by any released version shall load the same team in every later version.                                                                                                                                                                                                                                                                                                                        |
| BR-3 | Game data shall be live on the site within 2 days of Pokemon Showdown publishing it for a major change (a new game, or a new Pokemon Champions regulation), and within 7 days for a minor change (such as one pokemon losing one move). Data for a new game that Pokemon Showdown has not published within 7 days of the game's release shall be taken from another source **[A-3]**.                                                         |
| BR-4 | The site shall be usable in each of the nine languages of the Pokemon games and in Brazilian Portuguese.                                                                                                                                                                                                                                                                                                                                      |
| BR-5 | The redesigned site shall replace the old website as the version players choose. It has done so once all four hold: (a) fewer than 10% of its sessions switch to the old website; (b) fewer than five reports a month through feedback concern a defect of the redesign **[A-4]**; (c) its visits and its advertising revenue are at or above the old website's; (d) every function of the old website works on it and has an automated test. |
| BR-6 | The site shall run without a backend service other than hosting and feedback email, a constraint the Site Owner lifts only for the site's survival or for a feature the Site Owner rates extremely important. It shall need no more than one maintainer.                                                                                                                                                                                      |
| BR-7 | A wrong analysis result reported through feedback shall be corrected in production within 7 days of the report.                                                                                                                                                                                                                                                                                                                               |
| BR-8 | The site shall comply with the terms of its data and advertising providers: Pokemon Showdown (data, sprites), PokeAPI (names), and Playwire (ad placement, `ads.txt`, crawlers).                                                                                                                                                                                                                                                              |
| BR-9 | The site shall be the teambuilder that non-competitive players reach for: players who plan a team for a playthrough, a fan-made game, or for fun. The Site Owner would be proud of the site, a year from now, with team, language, and full generation support complete and a large share of that community using it. No measure of that share is set yet **[A-23]**.                                                                         |

### When players and upkeep conflict

When a change helps players but adds upkeep, players come first, unless the upkeep would stop the site being improved at all, such as a backend to run ([08](08-assumptions-and-interview.md#what-the-site-does-and-does-not-do)). That is why the site took on more generations, games, and languages despite the data and rules each one brings.

### Business rules

Rules that come from the games and from Pokemon Showdown, not from a choice made for this site.

| ID     | Business rule                                                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RULE-1 | A team has at most six pokemon, and a pokemon has at most four moves, one held item, and one ability.                                                                             |
| RULE-2 | The pokemon, formes, moves, items, abilities, base stats, and type chart available to a team are those of the team's generation and game.                                         |
| RULE-3 | Team text follows Pokemon Showdown's export format, so that text copied from either tool can be pasted into the other.                                                            |
| RULE-4 | Format (tier) membership follows Smogon's tiers as Pokemon Showdown publishes them, and the Pokemon Champions format follows the current regulation in Showdown's Champions data. |
| RULE-5 | Training values follow the game's system: DVs and stat experience in Generations 1 and 2, IVs and EVs from Generation 3, and stat points (SPs) in Pokemon Champions.              |

## 1.3 Scope

### Releases

| Release        | Contents                                                                                                                                                               | State                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| R0 Old website | Generations 6 to 9, one unsaved team, type defence and coverage, checklist, filters by format, type, and region, Showdown import and export, share link. English only. | Live at old.mypokemonteam.com                   |
| Ash            | The redesign: every feature listed below without a PF mark.                                                                                                            | Live at mypokemonteam.com since 13 October 2026 |
| Brock          | What is in the GitHub milestone of that name.                                                                                                                          | Next release                                    |
| Later          | What is in the GitHub milestone of that name: wanted after Brock, not scheduled.                                                                                       | Wanted                                          |

Later holds ideas such as suggesting teammates or moves to fix a weakness (today the site shows the weakness and leaves the choice to the player), analysis that looks beyond types, and a usage chart, which needs usage statistics the site does not have. Many players are children and teenagers **[A-24]**, so this work should keep the site simple rather than try to be too clever.

### What the site does today

The features of Ash, with the IDs the later documents use. **[Ash]** marks a feature that is new in the redesign; a feature with no mark is also on the old website. **[PFn]** marks a planned feature that the site does not have yet.

- **F1 Team Building**: six slots, each holding a pokemon, up to four moves, an item, and an ability.
  - F1.1 Pokemon Slots
    - F1.1.1 Slot Reordering [Ash]
    - F1.1.2 Automatic Item and Ability
  - F1.2 Set Details [Ash]: nickname, gender, level, shiny, tera type, nature, and training values.
    - F1.2.1 Training Values, by game: DVs and stat experience, IVs and EVs, or stat points. Awakening values and effort levels come with PF3.
  - F1.3 Randomize [Ash]: a random team, pokemon, or set details.
  - F1.4 Undo and Redo [Ash]
- **F2 Game Data**: the pokemon, moves, items, abilities, and rules of the chosen generation or game.
  - F2.1 Generation Profile, one of: Generations 6-9 combined, a single generation [Ash], Pokemon Champions [Ash], or Legends: Z-A [Ash]. Let's Go and Legends: Arceus come with PF3.
  - F2.2 Generation Transfer [Ash]: previews and applies the changes a team needs when its generation or game changes.
  - F2.3 Data Update Tooling
    - F2.3.1 Game Data Update, from Pokemon Showdown
    - F2.3.2 Translation Update, from PokeAPI [Ash]
- **F3 Pokemon Search**: finding a pokemon, move, item, or ability for a slot.
  - F3.1 Search by Name
  - F3.2 Filters: format, type, region, viable moves only, viable items only [Ash], and ability [Ash].
  - F3.3 Sort [Ash]
  - F3.4 Option Views, one of: list, grid [Ash], or big grid [Ash].
  - F3.5 Types Display [Ash]
- **F4 Team Analysis**
  - F4.1 Team Defence
  - F4.2 Team Type Coverage
  - F4.3 Score Explanations
  - F4.4 Team Checklist
    - F4.4.1 Battle Format Context, singles or doubles [PF1]
  - F4.5 Matrix Analysis [Ash]: every type against every pokemon, with the reason for each cell.
  - F4.6 Team Legality Warnings [PF6]
- **F5 Team Collection** [Ash]
  - F5.1 Saved Teams: any number of named teams in the browser, each with its generation, format, and filters.
  - F5.2 Synchronization Between Tabs
  - F5.3 Team Backups: a backup file holding every saved team, saved and restored under Teams → Team backups.
- **F6 Team Exchange**: a share link, Showdown team text, and Export All [Ash] for every saved team at once.
  - F6.1 Notice of Dropped Entries [PF7]
- **F7 Reference**: three type charts, a manual, the update log, credits, a privacy policy, and Pokemon Info [Ash] with each pokemon's base stats, abilities, and weaknesses.
  - F7.1 Dex Links [Ash] to Smogon, Bulbapedia, Serebii, and the Showdown dex.
- **F8 Presentation**
  - F8.1 Language, one of: English, Japanese, Korean, Simplified Chinese, Traditional Chinese, Spanish, French, German, Italian, or Brazilian Portuguese. All but English are [Ash].
    - F8.1.1 Translated Data Names [Ash], in every language except English and Brazilian Portuguese (PF4).
  - F8.2 Colour Scheme, one of: auto, light, or dark.
  - F8.3 Responsive Layout, on screens from 320 pixels wide.
  - F8.4 Animated Sprites
    - F8.4.1 Still Sprites [Ash]: chosen in the More menu, and the default on a device set to reduce motion.
- **F9 Feedback** [Ash]: a message to the Site Owner by email.
  - F9.1 Attach Team Link
  - F9.2 Attach Screenshot
  - F9.3 Attach Images
  - F9.4 Reply Address
- **F10 Site Versions** [Ash]
  - F10.1 Switch to Other Version
  - F10.2 Team Transfer to Old Website [Ash]
- **F11 Advertising**: ads placed by Playwire.

### Planned features

Each has a GitHub issue that names its ID. The issue holds the work, and its milestone holds the release.

| ID  | Planned feature                                                                                                    | State                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| PF1 | F4.4.1 Battle format for the checklist, so that it judges moves such as Defog correctly in Generations 4 and 5     | Planned                                                                                              |
| PF2 | F10.2 Team transfer to the old website, as a share link                                                            | Built on 14 October 2026                                                                             |
| PF3 | Let's Go and Legends: Arceus, with their training values. The generation menu lists them in its Coming soon group. | Planned                                                                                              |
| PF4 | Portuguese data names (F8.1.1 in Brazilian Portuguese)                                                             | Waits for PokeAPI to have Portuguese names, which should follow the games in 2027                    |
| PF5 | Verified sender domain for feedback                                                                                | Dropped on 14 October 2026: feedback goes only to the Site Owner, so players would see no difference |
| PF6 | F4.6 Team legality warnings: the rules in `src/store/validation.ts`, which no part of the page shows today         | Planned                                                                                              |
| PF7 | F6.1 Notice of dropped entries: telling a visitor which entries a link or saved team lost to a data update         | Planned                                                                                              |

### Not part of the plan

Not intended for now. None of these is ruled out for good; each would first need a business requirement of its own.

- Battling, damage calculation, and speed tiers. Pokemon Showdown and its damage calculator do these.
- Player accounts and server-side storage of teams. Teams stay in the browser; a backup file moves them between devices.
- Editing or hosting game data. Pokemon Showdown is the source, and the site ships a projection of it.
- Moderating or hosting shared teams. A share link holds the whole team; nothing is stored on a server.

### Dependencies and limitations

- Pokemon Showdown supplies the game data, the sprites, and the icon sheets. Sprites load from its servers, so they are missing when those servers are down. Where a network blocks them, as at many schools, the site loads the sprites through its own address instead (REQ-INTF-18).
- PokeAPI supplies the names in other languages. A name it lacks appears in English.
- Resend delivers feedback email from its shared address, which can reach only the Site Owner's own address. That is all feedback needs: it goes only to the owner, who replies from their own mail to the player's reply address.
- Playwire places the ads that pay for the site.
- Saved teams depend on the browser keeping its site storage. Clearing it, or a full disk, loses the teams that were not saved to a backup file.

## 1.4 Business risks

The Site Owner's one real worry is a takedown by the rights holders, RISK-8 ([08](08-assumptions-and-interview.md#purpose-and-money)). The others are listed with what reduces them.

- **RISK-1.** A data update renames or removes a pokemon, move, or item, and old share links and saved teams silently lose it. The update script reports those names before release (REQ-DATA-6), and PF7 will tell the visitor.
- **RISK-2.** The browser clears its site storage and the saved teams are lost. Team backups keep a copy (REQ-BKUP-1 to REQ-BKUP-8), and the site says when it could not save (REQ-COLL-9).
- **RISK-3.** Pokemon Showdown stops serving sprites to other sites, or changes its data layout. The icon sheets are bundled, and the data update writes only the fields the site reads (REQ-DATA-5). Sprites still come from Showdown's servers, even when the site forwards them to a network that blocks Showdown (REQ-INTF-18).
- **RISK-4.** A change to the page's structure removes the top ad banner, and revenue drops unnoticed. The banner's place is a requirement (REQ-INTF-5) that is checked on the production site.
- **RISK-5.** The maintainer is away, or does not hear of it, when a new game or regulation comes out, and the 2-day target of BR-3 is missed. Data updates are scripted and report what changed (REQ-DATA-1, REQ-DATA-6), every change passes the automated checks before it deploys, and a scheduled workflow tells the maintainer within a day when Showdown changes data the site uses (REQ-DATA-12).
- **RISK-6.** A wrong analysis result goes unreported, and players stop trusting the scores. Each score shows its reasons (REQ-ANLY-7), the rules have automated tests, and players can report errors through feedback (REQ-FEED-1).
- **RISK-7.** The feedback function or the sprite rewrite is abused to send spam or to proxy other sites' requests. REQ-SEC-1 to REQ-SEC-4 limit both.
- **RISK-8.** The rights holders object to the use of Pokemon names and artwork and have the site taken down. They have not acted against comparable sites. The site credits its sources (REQ-POL-3) and bundles no artwork beyond the icon sheets and the local sprites recorded with their sources.
- **RISK-9.** Players of the old website do not find the features they used, and leave. The header links to the old website (REQ-SITE-1), and the current team goes there with the player (REQ-SITE-3).
- **RISK-10.** Data taken from another source for a new game is wrong, or differs from Pokemon Showdown's when that arrives, and teams built on it change. Showdown's data replaces it once published (REQ-DATA-11), and players can report errors through feedback (REQ-FEED-1).
