# 6. Requirements Management, Traceability, and Prioritization

This document says how the requirements are identified, changed, and traced, and how the planned work is prioritized.

## 6.1 Identification

Every item has a symbolic identifier: a prefix for its kind and area, then a number. The numbers carry no order of importance, and an identifier is never reused once assigned, so a deleted requirement leaves a gap.

| Prefix          | Kind                            | Defined in                                        |
| --------------- | ------------------------------- | ------------------------------------------------- |
| BR-             | Business requirement            | [01](01-vision-and-scope.md)                      |
| RULE-           | Business rule                   | [01](01-vision-and-scope.md)                      |
| RISK-           | Business risk                   | [01](01-vision-and-scope.md)                      |
| SH-             | Stakeholder                     | [02](02-stakeholders-and-personas.md)             |
| P- (P-1 to P-5) | Persona                         | [02](02-stakeholders-and-personas.md)             |
| PL, OW, MA      | Softgoal of a stakeholder actor | [03](03-goal-model.md)                            |
| F, C            | Feature, cross-tree constraint  | [04](04-feature-model.md)                         |
| PF (PF1 to PF7) | Planned feature                 | [04](04-feature-model.md)                         |
| UC, US          | Use case, user story            | [05](05-system-requirements-specification.md)     |
| REQ-_AREA_-     | System requirement              | [05](05-system-requirements-specification.md)     |
| Issue number    | Work to do                      | GitHub issues, each naming its requirements (6.6) |
| M (M1 to M5)    | Mock-up                         | [10](10-mockups.md)                               |
| A-              | Assumption                      | [08](08-assumptions-and-interview.md)             |

Requirement areas: TEAM, DET, RAND, UNDO, FIND, ANLY, GEN, COLL, BKUP, LINK, TEXT, REF, LANG, THEME, FEED, SITE, DATA (functional); USE, PERF, INTF, OPS, MODE, SEC, INFO, POL, REL, MAINT (non-functional and interface).

## 6.2 Attributes and statuses

Only the attributes that are used are kept.

| Attribute            | Where it is kept                                                            | Values                                              |
| -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------- |
| Identifier           | With the requirement                                                        | See 6.1                                             |
| Importance           | With the requirement                                                        | Essential, Conditional, Optional                    |
| Status               | With the requirement                                                        | See below                                           |
| Source               | The use case or section the requirement sits under, and the matrices in 6.4 | A business requirement, a user story, a stakeholder |
| Rationale            | The text around the requirement; the goal model for conflicts               | Free text                                           |
| Confidence           | The **[A-n]** marker on a requirement that rests on an assumption           | Marked (low) or unmarked (full)                     |
| Acceptance criteria  | The user story before the requirement                                       | "Verify that" statements                            |
| Verification method  | Section 4 of the SyRS                                                       | Test, Inspection, Analysis, Demonstration           |
| Version, last update | The repository's history of the file                                        | Commits                                             |

Statuses:

- **Proposed**: suggested by a stakeholder or by the analyst, not yet agreed.
- **Approved**: agreed by the Site Owner and part of the baseline; committed to be implemented. Putting a requirement's issue in a release milestone, such as "Brock", approves it.
- **Implemented**: designed and built. Every requirement that describes the baseline `629b75f` has this status, as do REQ-FIND-12 and REQ-USE-17, which commit `8139648` of 14 October 2026 implemented by removing the Advanced switch.
- **Verified**: the tests named for it have been read and have passed. No requirement has this status yet, because the tests in Section 4 of the SyRS were matched by name only.
- **Rejected**: evaluated and declined, with the reason kept.
- **Deleted**: removed from the list; the identifier is not reused.

## 6.3 Baselines and change management

- **Baseline 0.1 (draft)**: these documents as first written, describing commit `629b75f` of `major-added-features`, 13 October 2026. It is a draft until the Site Owner has answered the interview in [08](08-assumptions-and-interview.md) and the assumptions have been corrected.
- **Baseline 1.0**: the documents after that review. From then on a change goes through the steps below.

The Oct 14, 2026 changes below changed only the requirements; the implementation and verification of the requirements they approve are pending.

**Oct 14, 2026 change request:** consolidate Team backups into Export All and Import Team, omit filters and unsaved drafts from exports, and skip duplicate imports. Matching details remain open in A-25, and how backup files saved before the change are loaded in A-26.

**Oct 14, 2026 mobile autofill request:** REQ-USE-19 is approved and applies to editable fields throughout the site, including dialogs. Personal-data autofill must be suppressed while the site's own option lists remain usable, as checked on native mobile browsers.

**Oct 14, 2026 dropdown keyboard request:** REQ-USE-20 is approved. Closing a dropdown on mobile must also dismiss the keyboard it opened, without an extra tap. Selection, dismissal, dialog closure, and transfer to another editable field are covered by the acceptance criteria.

**Oct 14, 2026 shared editing requirements:** REQ-USE-21 and REQ-USE-22 apply to team-data entry throughout the site, including UC13 Import Team Text and the team-text editor. REQ-USE-23 applies to all site dialogs. These requirements are approved. The proposal to disable saving without edits was withdrawn and is not a requirement. Editor-specific wording and layout proposals remain unapproved.

**Oct 14, 2026 editor parsing decision:** parsing reports are advisory. REQ-TEXT-12 and REQ-TEXT-13 are approved: explain parsing problems and their resulting omissions or fallbacks, while permitting an update without correction or an additional confirmation. REQ-TEXT-14 records the existing invalid-move-to-empty-slot behavior. The proposed blocking validation flow is rejected; the behavior model and acceptance criteria in Section 3.1.14 of [05](05-system-requirements-specification.md) now show the approved flow.

**Oct 14, 2026 advisory location correction:** the Site Owner rejected line-number references because the editor does not display line numbers. REQ-TEXT-12, its acceptance criteria, and the behavior model now identify problems by pokemon and field, including a move-slot number for move problems and a team-slot number for an unrecognized pokemon.

Change management, sized for one maintainer:

1. A change request is a GitHub issue or a feedback email. It states what should change and why.
2. Impact analysis: find the requirement in the SyRS, then follow the matrices in 6.4 upward to the business requirement it serves and across to the use case, the feature, and the tests it touches.
3. Decision by the Site Owner: approve, defer (it stays Proposed), or reject (status Rejected, with the reason).
4. An approved change updates the requirement, its user story's acceptance criteria, and its tests in the same pull request as the code, so the documents cannot fall behind the site.
5. A change that players will notice gets an update log entry (REQ-MAINT-5).

### Changes of 14 October 2026: what, not how

A review against the course's rule that a requirement states what the system does, not how, changed the requirements below. Rewritten requirements keep their identifiers; a requirement replaced by one with another meaning is deleted, and its identifier is not reused.

| Requirements                                                        | Change                                                                                                                                                      |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-INTF-1, 2, 5, REQ-FEED-8, 9, REQ-OPS-2, REQ-TEXT-10, REQ-USE-12 | Rewritten to state the outcome in place of the mechanism.                                                                                                   |
| REQ-PERF-4                                                          | Rewritten as a time to an editable team; the 600 kB script limit is kept as its design budget.                                                              |
| REQ-TEXT-11                                                         | Now says that the generation profile is part of the team read back, which REQ-TEXT-10 used to ensure.                                                       |
| REQ-INTF-6, REQ-USE-13                                              | Deleted: merged into REQ-INTF-5 and REQ-USE-12.                                                                                                             |
| REQ-INTF-9, 15, REQ-PERF-5, REQ-INFO-5, REQ-MAINT-2                 | Deleted: REQ-FEED-1 to 5, REQ-PERF-4, REQ-COLL-11, and REQ-LANG-1 already state their outcome.                                                              |
| REQ-INTF-16, REQ-OPS-3                                              | Deleted: replaced by REQ-FEED-10 and REQ-PERF-9.                                                                                                            |
| REQ-USE-8, 11, REQ-INTF-7, 10, 17, REQ-PERF-8                       | Moved to the design constraints, Section 3.14.1 of the SyRS.                                                                                                |
| REQ-OPS-1, REQ-POL-4, 5, REQ-REL-1 to 3, REQ-MAINT-1, 3 to 5        | Moved to the development constraints, Section 3.14.2.                                                                                                       |
| REQ-OPS-4, 5                                                        | Moved to the constraints on the old website, Section 3.14.3; REQ-OPS-5 no longer relies on "absolutely necessary".                                          |
| REQ-USE-1, 2, 9                                                     | Deleted: they cannot be verified without sessions or a survey with players, so they are now indicators in Section 3.7 of the goal model.                    |
| REQ-USE-14, 15                                                      | Rewritten to state how the actions and settings are grouped, not which buttons and menus hold them.                                                         |
| REQ-USE-18                                                          | Deleted: its condition, where the toolbar fits on one row, is a layout choice. The decision is kept as design in the text after the usability requirements. |

## 6.4 Traceability

### Traceability information model

Which kinds of artefact are linked, and by what. The rows of the matrices below are these links.

```mermaid
classDiagram
  direction LR
  class BusinessRequirement
  class Softgoal
  class Stakeholder
  class Persona
  class Feature
  class UserStory
  class UseCase
  class SystemRequirement
  class Test
  class Issue
  Softgoal "*" --> "1" Stakeholder : held by
  Persona "*" --> "1" Stakeholder : represents
  Feature "*" --> "*" Softgoal : contributes to
  UserStory "*" --> "1..*" Persona : told by
  UseCase "1..*" --> "1..*" UserStory : satisfies
  UseCase "*" --> "1..*" Feature : realizes
  SystemRequirement "*" --> "0..1" UseCase : derived from
  SystemRequirement "*" --> "1..*" BusinessRequirement : helps achieve
  Test "*" --> "1..*" SystemRequirement : tests
  Issue "*" --> "0..*" SystemRequirement : implements or verifies
```

Links are created by whoever has the information: the analyst links requirements upward, and the developer links tests to requirements when writing them. Links are kept at the level of requirement groups, not single requirements, because single-requirement links for more than two hundred requirements would not be maintained.

### Business requirements to system requirements

An X means the requirements of the row help achieve the business requirement of the column. Every row has at least one X, so no group of requirements is without a business reason, and every column has at least one, so no business requirement is without requirements.

| Requirements                   | BR-1 Revenue | BR-2 Links and teams keep loading | BR-3 Data within 2 or 7 days | BR-4 Ten languages | BR-5 Replace old website | BR-6 No backend | BR-7 Errors fixed in 7 days | BR-8 Providers' terms | BR-9 Non-competitive reach |
| ------------------------------ | :----------: | :-------------------------------: | :--------------------------: | :----------------: | :----------------------: | :-------------: | :-------------------------: | :-------------------: | :------------------------: |
| REQ-TEAM (UC1)                 |              |                                   |                              |         X          |            X             |                 |                             |                       |             X              |
| REQ-DET (UC2)                  |              |                                   |                              |                    |            X             |                 |                             |                       |                            |
| REQ-RAND (UC3)                 |              |                                   |                              |                    |            X             |                 |                             |                       |             X              |
| REQ-UNDO (UC4)                 |              |                                   |                              |                    |            X             |                 |                             |                       |                            |
| REQ-FIND (UC5)                 |              |                                   |                              |                    |            X             |                 |                             |           X           |             X              |
| REQ-ANLY-1 to 11, 20 (UC6)     |              |                                   |                              |                    |            X             |                 |              X              |                       |             X              |
| REQ-ANLY-12 to 19 (UC22, UC24) |              |                                   |                              |                    |            X             |                 |              X              |                       |                            |
| REQ-GEN (UC7)                  |              |                                   |              X               |                    |            X             |                 |                             |                       |             X              |
| REQ-COLL (UC8)                 |              |                 X                 |                              |                    |            X             |        X        |                             |                       |             X              |
| REQ-BKUP (UC9, UC10)           |              |                 X                 |                              |                    |                          |        X        |                             |                       |                            |
| REQ-LINK (UC11, UC12)          |              |                 X                 |                              |                    |            X             |                 |                             |                       |                            |
| REQ-TEXT (UC13, UC14)          |              |                 X                 |                              |                    |                          |                 |                             |           X           |                            |
| REQ-REF (UC15)                 |              |                                   |                              |                    |            X             |                 |                             |           X           |             X              |
| REQ-LANG (UC16)                |              |                                   |                              |         X          |                          |                 |                             |                       |             X              |
| REQ-THEME (UC17)               |              |                                   |                              |                    |            X             |                 |                             |                       |                            |
| REQ-FEED (UC18)                |              |                                   |                              |                    |            X             |                 |              X              |                       |                            |
| REQ-SITE (UC19, UC23)          |              |                                   |                              |                    |            X             |                 |                             |                       |                            |
| REQ-DATA (UC20, UC21)          |              |                                   |              X               |         X          |                          |        X        |                             |           X           |                            |
| REQ-USE                        |              |                                   |                              |                    |            X             |                 |                             |                       |             X              |
| REQ-PERF                       |      X       |                                   |                              |                    |            X             |                 |                             |                       |             X              |
| REQ-INTF                       |      X       |                 X                 |                              |                    |                          |                 |                             |           X           |             X              |
| REQ-OPS                        |              |                                   |              X               |                    |                          |        X        |              X              |                       |                            |
| REQ-MODE                       |      X       |                                   |                              |                    |                          |        X        |                             |                       |             X              |
| REQ-SEC                        |              |                 X                 |                              |                    |                          |        X        |                             |           X           |                            |
| REQ-INFO                       |              |                 X                 |                              |                    |            X             |                 |                             |                       |                            |
| REQ-POL                        |      X       |                                   |                              |                    |                          |                 |                             |           X           |                            |
| REQ-REL                        |              |                                   |              X               |                    |            X             |        X        |              X              |                       |                            |
| REQ-MAINT                      |      X       |                                   |              X               |         X          |                          |        X        |              X              |                       |                            |

### Business requirements to softgoals

| Business requirement                           | Softgoals it serves                                     |
| ---------------------------------------------- | ------------------------------------------------------- |
| BR-1 Revenue covers costs and the owner's time | OW1 Cover running costs and my time                     |
| BR-2 Links and teams keep loading              | PL4 Keep my teams, OW3 Keep players' trust              |
| BR-3 Data within 2 or 7 days                   | MA2 Keep game data current, PL2 Trust the results       |
| BR-4 Ten languages                             | PL6 Use the site in my language and on my device, OW2   |
| BR-5 Replace the old website                   | OW2 Grow and keep the audience, PL1, PL3, PL5           |
| BR-6 No backend by preference, one maintainer  | MA1 Low maintenance effort, OW1                         |
| BR-7 Reported errors fixed in 7 days           | PL2 Trust the results, OW3, OW4 Learn what players need |
| BR-8 Providers' terms                          | OW1 (through its dependency on the ad platform), MA2    |
| BR-9 Non-competitive reach                     | OW2 Grow and keep the audience, PL3, PL6                |

### Personas, user stories, use cases, and requirements

| User story | Persona who tells it most | Use case                                    | Requirements                 |
| ---------- | ------------------------- | ------------------------------------------- | ---------------------------- |
| US1        | P-1 Maya, P-5 Leo         | UC1 Build Team                              | REQ-TEAM-1 to 15             |
| US2        | P-2 Daniel                | UC2 Set Pokemon Details                     | REQ-DET-1 to 8               |
| US3        | P-1 Maya, P-5 Leo         | UC3 Randomize Team                          | REQ-RAND-1 to 5              |
| US4        | P-1 Maya, P-2 Daniel      | UC4 Undo Change                             | REQ-UNDO-1 to 5              |
| US5        | P-2 Daniel, P-3 Sofía     | UC5 Narrow Pokemon Choices                  | REQ-FIND-1 to 12             |
| US6        | P-1 Maya, P-2 Daniel      | UC6 Analyze Team                            | REQ-ANLY-1 to 11, 20         |
| US7        | P-4 Kenji                 | UC7 Change Generation                       | REQ-GEN-1 to 12              |
| US8        | P-3 Sofía                 | UC8 Manage Saved Teams                      | REQ-COLL-1 to 13             |
| US9        | P-3 Sofía                 | UC9 Back Up Teams                           | REQ-BKUP-1, 6, 8, 9          |
| US10       | P-3 Sofía                 | UC10 Restore Teams                          | REQ-BKUP-2, 3, 10            |
| US11       | P-2 Daniel, P-3 Sofía     | UC11 Share Team by Link                     | REQ-LINK-1 to 3              |
| US12       | P-4 Kenji                 | UC12 Open Shared Team                       | REQ-LINK-4 to 11, REQ-INFO-8 |
| US13       | P-2 Daniel                | UC13 Import Team Text                       | REQ-TEXT-1 to 4              |
| US14       | P-2 Daniel                | UC14 Export Team Text                       | REQ-TEXT-5 to 14             |
| US15       | P-1 Maya                  | UC15 Look Up Reference                      | REQ-REF-1 to 6               |
| US16       | P-3 Sofía, P-4 Kenji      | UC16 Change Language                        | REQ-LANG-1 to 8              |
| US17       | P-1 Maya                  | UC17 Change Colour Scheme                   | REQ-THEME-1, 2               |
| US18       | P-2 Daniel                | UC18 Send Feedback                          | REQ-FEED-1 to 11             |
| US19       | P-4 Kenji                 | UC19 Switch Site Version                    | REQ-SITE-1, 2                |
| US20       | Maintainer (SH-2)         | UC20 Update Game Data                       | REQ-DATA-1 to 7, 10 to 12    |
| US21       | Maintainer (SH-2)         | UC21 Update Translations                    | REQ-DATA-8, 9                |
| US22       | P-3 Sofía, P-4 Kenji      | UC22 Set Battle Format (planned)            | REQ-ANLY-12 to 17            |
| US23       | P-4 Kenji                 | UC23 Transfer Team to Old Website (planned) | REQ-SITE-3, 5                |
| US24       | P-2 Daniel                | UC24 Check Team Legality (planned)          | REQ-ANLY-18, 19              |

The non-functional requirements are not derived from one use case. REQ-USE, REQ-PERF, REQ-MODE, and REQ-INFO relate to every use case; REQ-SEC-1 to 3 relate to UC18, and REQ-SEC-5 to UC10, UC12, and UC13.

Features to use cases are in Section 4.6 of the [feature model](04-feature-model.md). Requirements to tests are in Section 4 of the [SyRS](05-system-requirements-specification.md).

## 6.5 Prioritization

Requirements with status Implemented need no ordering. The work still to do on the requirements is ordered on the project board "My Pokemon Team Development" with the method below. Each issue's ratings and priority are kept on the board, not in these documents.

Importance (Essential, Conditional, Optional) is kept with each requirement and says how much the product needs it. Priority is kept with each issue and says what to do next.

### Wiegers' prioritization

Each issue is rated from 1 to 9 for its benefit, the penalty of not doing it, and its risk, in the board's Benefit, Penalty, and Risk fields. Its cost is its Size on the board: XXS 1, XS 2, S 3, M 4, L 5, XL 6, XXL 7, 3XL 9. The weights are 2 for benefit, 1 for penalty, 1 for cost, and 0.5 for risk:

```
score = (2 x benefit + 1 x penalty) / (1 x cost + 0.5 x risk)
```

The score sets the issue's Priority: P1 from 3.5, P2 from 2.0, and P3 below 2.0. P0 is kept for outages. A blocked issue is P3 until it is unblocked. An issue labelled `no requirement` is not rated and has no priority.

The course's form divides each rating by its column's total before combining them, which makes every score depend on every other issue: opening or closing one changes them all. Here each issue is scored from its own ratings, so it can be rated when it is opened. The cutoffs were set so that the issues rated on 13 October 2026 kept the levels the course's form gave them.

The Site Owner's decision (interview, Q16) is to follow this ranking. The ratings are the analyst's estimates **[A-20]** until the Site Owner replaces them.

### Calibration

The weights are the ones in the course's example. The Site Owner has noted (13 October 2026) that cost may deserve less weight, because coding agents do much of the implementation, and that its weight could be halved from 1 to 0.5 if the ranking proves unsatisfying. It has not been changed. Halving it raises every score, so the cutoffs would have to be set again.

Other techniques the course teaches would add to this once players can be asked: a Kano survey would show which planned features players take for granted and which would delight them, and a 100-dollar test would let the Site Owner and a few players each spread 100 points over the list.

## 6.6 Requirements and GitHub issues

Work to do is kept only in the project's GitHub issues and on its project board, not in these documents.

- An issue that implements or verifies requirements names them at its start, as "**Requirement:** REQ-...". Searching the issues for a requirement's identifier finds the work on it.
- A defect in, or an improvement to, an Implemented requirement names that requirement too, and is rated like any other issue.
- An issue tied to no requirement carries the label `no requirement` and has no priority until a requirement is written for it.
- The milestone "Ash" holds the tasks left before the redesign is released, "Brock" holds the release after it, and "Later" holds what is wanted after that, unscheduled. A rated issue with no milestone is ranked but not yet scheduled. Planned features are named PF1 to PF7 ([04](04-feature-model.md), Section 4.3) so that they are not mistaken for the priorities P0 to P3.

Work that has no issue because it recurs: running the data and translation updates after each Pokemon Showdown change (BR-3), and reviewing the weekly dependency update (REQ-MAINT-3). Two pieces of requirements work are deferred and have no issue: usability sessions and surveys of players (the indicators of Section 3.7 of the [goal model](03-goal-model.md), formerly REQ-USE-1, 2, and 9), which the Site Owner set aside on 13 October 2026 as useful later for gauging the audience.
