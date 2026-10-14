# 12. Analysis of Player Feedback

Requirement level: user. Until now, everything these documents said about players was assumed. This document replaces part of that with evidence: what players wrote to the Site Owner between 2021 and October 2026.

## 12.1 What was read, and its limits

The Site Owner's mailbox was searched on 13 October 2026, with permission, for mail about the site. Of 200 threads found, about 105 were from players. The rest were analytics reports, advertising and acquisition approaches, and solicitations, which are not analysed here.

- Only the subject and the opening lines of each thread's first message were read, except for the two feedback messages about the redesign, which were read in full.
- Threads were sorted into themes by keyword, so the counts are approximate. A thread can fall under more than one theme.
- People who write in are not a fair sample of players. They are the ones who hit a problem and cared enough to report it, in English.
- Nothing here identifies a sender. No names, addresses, or quotations are kept in this repository.

Player threads per year: 9 in 2021, 16 in 2022, 14 in 2023, 21 in 2024, 17 in 2025, and 28 so far in 2026.

## 12.2 Themes

| Theme                        | Threads  | Typical message                                                                                                                   |
| ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Missing or late data         | About 50 | A new pokemon, forme, or mega evolution is not there yet; a pokemon cannot be given a move it learns; asks when an update is due. |
| Praise                       | About 25 | The site is the writer's favourite or the best they have used, usually followed by a report.                                      |
| Wrong analysis result        | About 15 | An ability, a move, or a type is scored wrongly, with the pokemon and the move named.                                             |
| Sprites or icons not showing | About 12 | A regional forme, a mega evolution, or a recent pokemon has no picture.                                                           |
| Saving teams                 | About 5  | The team is gone after a refresh or after the phone's browser reopens; asks for a way to save, or for an account.                 |
| Crash or blank page          | About 3  | Choosing one particular pokemon, or opening one filter, blanks the page.                                                          |
| Import, export, or sharing   | About 3  | Import did not work; asks for shareable links.                                                                                    |

Smaller themes, one to three threads each:

- Requests to support games outside the main series: a fan-made game built on one generation with later pokemon added, a fan game's egg moves, and a game played through a streaming extension.
- A request for a mode with no restrictions, so that any pokemon from any generation can share a team.
- Checklist: what "volt-turn" means; a ladder player asking for priority moves to be a checklist item.
- Showing the type of each move in the move list.
- Advertisements getting into screenshots of a team on a tablet.
- Permission to show the site in a video.
- Pokemon whose two genders look different having only one of them.

## 12.3 What the feedback shows

**Data being current and complete is what players care about most.** Nearly half of all player threads are about something missing. The messages cluster after each release: the Hisuian pokemon in 2022, Generation 9 in late 2022, and the Legends: Z-A mega evolutions in the first half of 2026, where at least eight players asked when they would be added. This supports BR-3 as written after the interview (2 days for major data) and explains why the Site Owner set it that tight.

**Players do report wrong results, and they are specific.** About fifteen threads name a pokemon, a move or ability, and what the score should be. This is the behaviour BR-7 relies on. Two problems reported by mail more than once, the Dry Skin ability and Smeargle's move list, were also filed as GitHub issues 63 and 64, both since fixed.

**Missing pictures are the second most common complaint about the site itself.** A pokemon without a sprite or an icon reads to players as a broken site, not as a small gap. This raises the importance of REQ-INTF-1, REQ-INTF-2, and REQ-MODE-3, and it is the subject of issue 76, about not depending on Pokemon Showdown for images, now REQ-INTF-18.

**Saving teams was asked for from 2021 on.** Players asked for a way to keep a team, and one for an account. The redesign's saved teams (F5) answer the first without the second.

**Many writers are not competitive players.** They build teams for a playthrough, for a fan-made game, for characters of their own, or for fun, and several write from school addresses. One competitive ladder player identified themselves as such; no message was about tiers, doubles formats, or tournament preparation. This matches the Site Owner's aim of serving the non-competitive community (BR-9).

**The redesign's first day produced the clearest single finding.** Within hours of the redesign going live on 10 October 2026, two players wrote that choosing one generation or game stopped them from building the team they wanted: one mixes pokemon from every generation, and one plays a fan-made game that combines two generations. The Site Owner put the old website back the same day, and two days later made the combined Generations 6 to 9 profile the default (REQ-GEN-2, REQ-GEN-3). The lesson for the requirements is that a restriction which is correct for a competitive player is a barrier for a non-competitive one, and the default has to serve the second.

**Feedback sent without a reply address cannot be answered.** Both of those messages came through the new feedback form with no reply address, so the Site Owner's answers went to the form's sending address, which no player reads. The form already says that the email is optional and only needed for a reply (REQ-FEED-4, REQ-FEED-11), and leaving it empty is how a player stays anonymous, so this is the form working as meant. When a player gives an address, the feedback function sets it as the email's reply-to, and the answer reaches them.

## 12.4 Effect on the personas

| Persona                                  | Support in the feedback                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| P-1 Maya, in-game player on a phone      | Strong. Playthrough teams, phone and tablet use, lost teams, and unexplained terms all appear.                     |
| P-2 Daniel, competitive singles player   | Weak. One ladder player; a few precise reports of wrong results; two or three messages about import.               |
| P-3 Sofía, doubles player in Spanish     | Weak. Writers from Brazil and France appear, but none mentions doubles, backups, or another language.              |
| P-4 Kenji, returning player of old games | None found. Nobody wrote about Generations 1 to 5 or about old links.                                              |
| P-5 Leo, dream-team and fan-game builder | Added from this analysis. The redesign's first-day feedback and the requests for fan games and unrestricted teams. |

P-2 to P-4 stay, marked as assumed, because silence in a mailbox is weak evidence: a player whose import works does not write in. P-5 is in [02-stakeholders-and-personas.md](02-stakeholders-and-personas.md).

## 12.5 Candidates raised by players

Not requirements. Each was asked for by at least one player and is not in the feature model.

| Candidate                                                | Asked by        | Note                                                                                        |
| -------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------- |
| A mode with no restriction by game                       | 2 players, 2026 | Largely met by the Generations 6 to 9 combined default; pokemon-only freedom may be enough. |
| Fan-made games (their pokemon lists and moves)           | 3 players       | Each fan game is its own data source; costly to maintain (MA1).                             |
| Priority moves as a checklist item                       | 1 ladder player | Small; changes F4.4.                                                                        |
| Both gender forms of pokemon whose genders differ        | 1 player        | A data and sprite question.                                                                 |
| Advertisements kept out of the area a player screenshots | 1 player        | Touches the ad placement (REQ-INTF-5); a share image would also answer it.                  |
