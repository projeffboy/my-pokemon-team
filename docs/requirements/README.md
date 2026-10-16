# My Pokemon Team: Requirements

What [mypokemonteam.com](https://mypokemonteam.com) is for, who uses it, and what it shall do. These documents describe the site as it is built, plus the changes the Site Owner has approved that are not built yet. Their history is in git.

## Documents

Start with 01 and 05: they say what the site is for and what it does. 08 records the Site Owner's decisions and the questions still open. 02, 11, and 12 are the research behind them.

| Document                                                                        | What it holds                                                                                                                                    |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [01 Vision and scope](01-vision-and-scope.md)                                   | Why the site exists, its business requirements and rules, its scope, its features (built and planned), and its risks.                            |
| [02 Stakeholders and personas](02-stakeholders-and-personas.md)                 | Who has a stake in the site, how players differ, and two personas.                                                                               |
| [05 System requirements specification](05-system-requirements-specification.md) | The use cases, each with its user story and requirements; the non-functional requirements and constraints; and how each requirement is verified. |
| [08 Decisions and open questions](08-assumptions-and-interview.md)              | What the Site Owner decided and why, and the questions still open.                                                                               |
| [11 Analysis of existing systems](11-existing-systems-analysis.md)              | Six competing products, their features, and what sets the site apart.                                                                            |
| [12 Analysis of player feedback](12-feedback-analysis.md)                       | What about 105 player emails from 2021 to 2026 asked for and complained about, and what that changed.                                            |

## Conventions

- "The site" is the website, its feedback function, and its data update scripts.
- A requirement is one sentence whose subject is the site (or a named part of it) and whose verb is "shall". It says what the site does, not how.
- Pokemon terms and abbreviations are defined in [Section 1.2 of the SyRS](05-system-requirements-specification.md#12-definitions).
- Diagrams are Mermaid, which GitHub renders.

## Identifiers

Every item has an identifier: a prefix, then a number. The numbers carry no order of importance. A number is not reused once it has appeared in a commit or an issue, so a deleted requirement leaves a gap.

| Prefix         | Item                                                               | Defined in                                    |
| -------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| BR, RULE, RISK | Business requirement, business rule, business risk                 | [01](01-vision-and-scope.md)                  |
| F, PF          | Feature, planned feature                                           | [01](01-vision-and-scope.md)                  |
| SH, P          | Stakeholder, persona                                               | [02](02-stakeholders-and-personas.md)         |
| UC, US         | Use case, user story                                               | [05](05-system-requirements-specification.md) |
| REQ-_AREA_     | System requirement; the area names its group, such as TEAM or LINK | [05](05-system-requirements-specification.md) |
| A              | An open question; a statement marked **[A-n]** rests on it         | [08](08-assumptions-and-interview.md)         |

Planned features are PF, not P, so that they are not mistaken for the priorities P0 to P3.

Issues closed as not planned on 14 October 2026 name some draft numbers that no document defines: REQ-USE-13 and "Table 3.2-1" (issue 146), REQ-TEXT-12 (issue 149), REQ-COLL-14 and 15 (issue 150), and REQ-FEED-10 (issue 151). Those numbers are not used.

Team backups were removed on 16 October 2026, and with them UC9, UC10, US9, US10, REQ-BKUP-1 to 8, REQ-INTF-11, REQ-INFO-3, and F5.3. Those numbers are not used again.

## Statuses

Each requirement has an importance and a status. Importance (Essential, Conditional, Optional) says how much the site needs it. Priority belongs to issues, not requirements, and says what to do next.

- **Proposed**: suggested or set aside, not agreed.
- **Approved**: the Site Owner agreed to it, in his own words or by putting its issue in a release milestone such as Brock, and it is not built yet. If that issue is closed as not planned, the requirement goes back to Proposed.
- **Implemented**: the code does it.
- **Verified**: implemented, and a test that checks all it states has been read and passes. Section 4 of the SyRS names that test.
- **Rejected**: declined; the reason is kept with it.
- **Deleted**: removed; its number is not reused.

## Issues and priorities

Work to do lives only in the GitHub issues and on the project board "My Pokemon Team Development". These documents hold no task list and no ranking of tasks.

- Every issue names the requirements it covers at the start of its body, as "**Requirement:** REQ-...". A defect in, or an improvement to, a built requirement names that requirement too. Searching the issues for an identifier finds the work on it.
- An issue tied to no requirement carries the label `no requirement`, and has no priority until a requirement is written for it.

Priority follows Wiegers' method. Each issue is rated from 1 to 9 for its benefit, the penalty of not doing it, and its risk, in the board's Benefit, Penalty, and Risk fields. Its cost is its Size: XXS 1, XS 2, S 3, M 4, L 5, XL 6, XXL 7, 3XL 9.

```
score = (2 x benefit + 1 x penalty) / (1 x cost + 0.5 x risk)
```

The score sets the issue's Priority: P1 from 3.5, P2 from 2.0, and P3 below 2.0. P0 is kept for outages, and a blocked issue is P3 until it is unblocked. The Site Owner follows the ranking this gives.

Each issue is scored from its own ratings, so a new issue can be rated without working out the others again. Wiegers' full method divides each rating by its column's total, which changes every score whenever an issue is opened or closed; the Site Owner dropped that step on 14 October 2026. The cutoffs were set so that the issues rated on 13 October 2026 kept the levels the full method gave them.

The weights are Wiegers' usual ones. Because coding agents do much of the implementation, the Site Owner may halve the weight of cost to 0.5 if the ranking proves unsatisfying. That would raise every score, so the cutoffs would have to be set again.

## Private notes

Traffic figures, advertising arrangements, and offers made to the Site Owner are kept in a local `private/` folder beside these documents, which `.gitignore` keeps out of the repository. Nothing in these documents identifies a player who wrote in.

## When the documents and the code disagree

The code wins, and the document gets corrected.
