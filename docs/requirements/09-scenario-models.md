# 9. Scenario Models

Requirement level: user and system. The use cases in the [SyRS](05-system-requirements-specification.md) describe each flow in words, one use case at a time. These diagrams show the same flows as pictures and show what a single use case cannot: several use cases in one flow, work done at the same moment, and messages between the site's major parts.

The course models scenarios with Use Case Maps in the jUCMNav tool, and also teaches UML activity diagrams for workflows and UML sequence diagrams for requirements-level interactions. These are the UML ones, drawn in Mermaid so that they render with the documents. They add no requirements; where a diagram and a use case disagree, the use case is right and the diagram is to be corrected.

## 9.1 Notation

Mermaid has no activity diagram, so each one is a flowchart read as follows:

- A frame is a **partition** (swimlane): who does the work inside it.
- A circle labelled start or end is the **start** or the **activity final** node.
- A rectangle is an **action**.
- A diamond is a **decision** (one flow in, guarded flows out) or a **merge** (several flows in, one out). Guards are in square brackets.
- A slanted box labelled fork or join is a **fork** bar (the flows after it happen concurrently) or a **join** bar (the flow continues once all of them are done).
- An action marked "(planned)" belongs to a requirement with status Proposed or Approved, not Implemented.

The sequence diagrams follow the course's advice for the requirements level: the participants are only actors and major system components, with no internal objects.

## 9.2 Activity: build a team and read its analysis

Covers UC1 Build Team, UC5 Narrow Pokemon Choices, and UC6 Analyze Team. It shows why the site needs no save action: every recorded choice forks into presenting the analysis, keeping the team in the browser, and writing it to the address.

```mermaid
flowchart TD
  subgraph Player
    start((start)) --> Request[Request the pokemon for a slot]
    Change[Change the filters or the name typed]
    Select[Select a pokemon]
    More{decision}
    Detail[Select a move, an item, or an ability]
    Explain[Request the reason for a score]
    finish((end))
  end
  subgraph Site["My Pokemon Team"]
    List[Present the pokemon that match the filters, in the sort order]
    Any{decision}
    None[Inform that no pokemon match]
    Record[Record the pokemon, its required item, and its only ability]
    RecordDetail[Record the selection]
    M{merge}
    F[/fork/]
    Analyse[Present defence scores, coverage scores, and checklist]
    Keep[Keep the team in the browser]
    Address[Write the team to the page's address]
    J[/join/]
    Reason[Present the pokemon and the multiplier or move counted]
  end
  Request --> List --> Any
  Any -- "[no pokemon match]" --> None --> Change --> Request
  Any -- "[some match]" --> Select --> Record --> M
  M --> F
  F --> Analyse --> J
  F --> Keep --> J
  F --> Address --> J
  J --> More
  More -- "[more to set on this pokemon]" --> Detail --> RecordDetail --> M
  More -- "[another slot]" --> Request
  More -- "[a score is unclear]" --> Explain --> Reason --> More
  More -- "[team is done]" --> finish
```

## 9.3 Activity: share a team and open the link

Covers UC11 Share Team by Link and UC12 Open Shared Team. The second partition of the site is the same site running in the Link Recipient's browser, with the Recipient's own saved teams.

```mermaid
flowchart TD
  subgraph Player
    start((start)) --> Ask[Request the team's share link]
    Send[Send the link to the Link Recipient]
  end
  subgraph SiteA["My Pokemon Team, in the Player's browser"]
    Empty{decision}
    Nothing[Inform that there is nothing to share]
    Copy[Copy the link and inform the Player]
  end
  subgraph Recipient["Link Recipient"]
    Open[Open the link]
    Edit{decision}
    Look[Read the team and its analysis]
    ChangeIt[Change the team]
  end
  subgraph SiteB["My Pokemon Team, in the Link Recipient's browser"]
    Read[Read the team and the generation profile from the link]
    Readable{decision}
    Own[Present the Recipient's own current team]
    Same{decision}
    Saved[Make the matching saved team the current team]
    Draft[Make the linked team the current team, as a draft]
    M{merge}
    Left{decision}
    Notice["Name the entries left out of the team (planned)"]
    Analyse[Present the team and its analysis]
    Add[Add the team to the saved teams]
  end
  finish((end))
  Ask --> Empty
  Empty -- "[team has no pokemon]" --> Nothing --> finish
  Empty -- "[team has pokemon]" --> Copy --> Send --> Open --> Read --> Readable
  Readable -- "[link cannot be read]" --> Own --> finish
  Readable -- "[link holds a team]" --> Same
  Same -- "[equals a saved team]" --> Saved --> M
  Same -- "[equals no saved team]" --> Draft --> M
  M --> Left
  Left -- "[entries were left out]" --> Notice --> Analyse
  Left -- "[nothing was left out]" --> Analyse
  Analyse --> Look --> Edit
  Edit -- "[changes nothing]" --> finish
  Edit -- "[changes a draft]" --> ChangeIt --> Add --> finish
```

A change to a team that was already saved is kept as any other change is; only a draft is added to the saved teams by its first change. The action marked "(planned)" is REQ-INFO-8 (P7); today the entries are left out without a word. Mock-up M4 in [10-mockups.md](10-mockups.md) shows the notice.

## 9.4 Activity: change a team's generation

Covers UC7 Change Generation. The decision that matters is the second one: the site asks only when something would be lost.

```mermaid
flowchart TD
  subgraph Player
    start((start)) --> Pick[Request another generation profile for the team]
    Choose{decision}
  end
  subgraph Site["My Pokemon Team"]
    Load[Obtain the availability data of the new profile]
    Loaded{decision}
    Fail[Inform that the generation data could not be loaded]
    Plan[Work out what the team would lose or have converted]
    Loss{decision}
    Show[Present the unavailable pokemon and the moves, items, abilities, and details to be removed or converted]
    Update[Remove what is unavailable, convert the training values, and record the new profile]
    CopyTeam[Create a saved team in the new profile from what carries over, leaving the original unchanged]
    M{merge}
    Analyse[Present the team's analysis under the new profile]
  end
  finish((end))
  Pick --> Load --> Loaded
  Loaded -- "[data unavailable]" --> Fail --> finish
  Loaded -- "[data obtained]" --> Plan --> Loss
  Loss -- "[nothing would be lost]" --> Update
  Loss -- "[something would be lost]" --> Show --> Choose
  Choose -- "[update the team]" --> Update --> M
  Choose -- "[copy to a new team]" --> CopyTeam --> M
  Choose -- "[cancel]" --> finish
  M --> Analyse --> finish
```

## 9.5 Sequence: send feedback

Covers UC18 Send Feedback and the security requirements REQ-SEC-1 to REQ-SEC-3. The participants are the two actors, the two parts of the site that the context diagram already separates (the page in the browser and the feedback function on the hosting platform), and the email delivery service.

```mermaid
sequenceDiagram
  actor Player
  participant Page as Site: page
  participant Function as Site: feedback function
  participant Mail as Email Delivery Service
  actor Owner as Site Owner
  Player->>Page: message, reply address, images
  Page->>Page: validate, reduce images, capture the page
  alt reply address or images not valid
    Page-->>Player: what to correct
  else valid
    Page->>Function: feedback (message, reply address, link, screen, pictures)
    alt not from the site's own pages
      Function-->>Page: refused
      Page-->>Player: not sent, address to write to
    else more than 5 messages in 10 minutes
      Function-->>Page: too many messages
      Page-->>Player: not sent, address to write to
    else accepted
      Function->>Mail: message for the Site Owner
      alt delivery accepted
        Mail-->>Function: accepted
        Function-->>Page: sent
        Page-->>Player: feedback was sent
        Mail->>Owner: email with the feedback
      else delivery refused
        Mail-->>Function: refused
        Function-->>Page: could not send
        Page-->>Player: not sent, address to write to, message kept
      end
    end
  end
```

## 9.6 Sequence: two tabs keep the same saved teams

Covers REQ-COLL-11 and REQ-INFO-5 of UC8 Manage Saved Teams: a Player with the site open twice does not lose in one tab what was done in the other.

```mermaid
sequenceDiagram
  actor Player
  participant A as Site: tab A
  participant Store as Browser storage
  participant B as Site: tab B
  Player->>A: change team X
  A->>Store: read what other tabs saved
  A->>Store: save, merged team by team
  Store-->>B: saved teams changed
  B->>B: take in team X as changed
  Player->>B: change team Y
  B->>Store: read what other tabs saved
  B->>Store: save, merged team by team
  Store-->>A: saved teams changed
  A->>A: take in team Y as changed
  Note over A,B: A tab with no change of its own writes nothing
```

## 9.7 Activity: update game data

Covers UC20 Update Game Data and UC21 Update Translations, with the timing that BR-3 sets. The actions marked "(planned)" are REQ-DATA-10 to REQ-DATA-12.

```mermaid
flowchart TD
  subgraph Showdown["Pokemon Showdown"]
    start((start)) --> Publish[Publish a change to game data]
    Late[Publish nothing for a new game within 7 days of its release]
  end
  subgraph Tooling["Site: update tooling"]
    Notify["Notify the Maintainer within 1 day (planned)"]
    Fallback["Generate the new game's data from another source (planned)"]
    Regenerate[Regenerate the game data]
    Report[Report renamed and removed names, changed icon sheets, and missing sprites]
    Names[Regenerate the translated names and report those left in English]
    Checks[Run type checks, lint, rule tests, smoke tests, and browser tests]
  end
  subgraph Maintainer
    Run[Run the data update]
    Broken{decision}
    Fix[Bundle the missing sprites and note the names old links will lose]
    RunNames[Run the translation update]
    Pass{decision}
    Correct[Correct what failed]
    Log[Add an update log entry and merge to master]
  end
  subgraph Hosting["Hosting platform"]
    Deploy[Deploy to production]
    finish((end))
  end
  M{merge}
  Publish --> Notify --> Run --> Regenerate --> M
  Late --> Fallback --> M
  M --> Report --> Broken
  Broken -- "[report lists problems]" --> Fix --> RunNames
  Broken -- "[report is clean]" --> RunNames
  RunNames --> Names --> Checks --> Pass
  Pass -- "[a check fails]" --> Correct --> Checks
  Pass -- "[all pass]" --> Log --> Deploy --> finish
```

From Publish to Deploy the flow has 2 days for a major change and 7 days for a minor one (BR-3). Data that came through the fallback path is replaced by running the flow again from Publish once Pokemon Showdown has the game (REQ-DATA-11).

## 9.8 Activity (planned): judge the Spinner/Defogger role

Covers UC22 Set Battle Format (P1) and REQ-ANLY-14 to REQ-ANLY-16. This is the rule the battle format exists for, drawn as the decisions the site makes for one team. Today the site stops at the generation: before Generation 6 it never counts Defog, which is wrong for doubles.

```mermaid
flowchart TD
  start((start)) --> Other{decision}
  Other -- "[a pokemon can use Rapid Spin, Court Change, Tidy Up, or Mortal Spin]" --> Filled[Mark the role as filled]
  Other -- "[none can]" --> Defog{decision}
  Defog -- "[no pokemon can use Defog]" --> Unfilled[Mark the role as unfilled]
  Defog -- "[a pokemon can use Defog]" --> Gen{decision}
  Gen -- "[team is Generation 6 or later]" --> Filled
  Gen -- "[team is Generation 4 or 5]" --> Format{decision}
  Format -- "[battle format is doubles]" --> Filled
  Format -- "[battle format is singles]" --> Unfilled
  Format -- "[battle format is not set]" --> Depends["Mark the role as depending on the battle format, and say why (planned)"]
  Filled --> finish((end))
  Unfilled --> finish
  Depends --> finish
```

The three decisions below the first are new. Mock-ups M1 and M2 in [10-mockups.md](10-mockups.md) show two places the battle format could be set.

## 9.9 Activity (planned): take the current team to the other site version

Covers UC19 Switch Site Version and UC23 Transfer Teams Between Versions (P2). It assumes the team crosses as a share link (A-14), because the two versions are at different addresses and neither can read the other's saved teams.

```mermaid
flowchart TD
  subgraph Player
    start((start)) --> Ask[Request the other site version]
    Confirm{decision}
  end
  subgraph Here["Site version the Player is on"]
    Empty{decision}
    Work["Work out what the other version cannot hold (planned)"]
    Warn["Present what will carry over and what will not (planned)"]
    Go["Open the other version with the current team's share link (planned)"]
    Plain[Open the other version without a team]
  end
  subgraph There["The other site version"]
    Read[Read the team from the link]
    Match{decision}
    Saved[Make the matching saved team the current team]
    Draft[Make the team the current team, as a draft]
    Show[Present the team and its analysis]
  end
  finish((end))
  Ask --> Empty
  Empty -- "[current team has no pokemon]" --> Plain --> finish
  Empty -- "[current team has pokemon]" --> Work --> Warn --> Confirm
  Confirm -- "[cancel]" --> finish
  Confirm -- "[go with my team]" --> Go --> Read --> Match
  Match -- "[equals a saved team there]" --> Saved --> Show
  Match -- "[equals no saved team there]" --> Draft --> Show
  Show --> finish
```

The other version's part is UC12 Open Shared Team, which both versions already do. What is new is on the leaving side. The old website holds one unsaved team and covers Generations 6 to 9 only, so its Match decision always takes the draft branch, and a team from another generation cannot arrive whole. Mock-up M5 shows the confirmation.

## 9.10 Planned features without a flow diagram

- **P6 Team legality warnings**: the site already computes the rules; the feature is a display of them, shown in mock-up M3. There is no new flow.
- **P5 Verified sender domain** and **P4 Portuguese data names**: neither changes a flow. P5 changes the address in the "message for the Site Owner" step of 9.5; P4 changes the data that the translation step of 9.7 produces.
- **P3 More games**: each game adds choices to the generation profile, and its flow is 9.4.
- **The notice of Showdown data changes and the fallback data source**: both are in 9.7.

## 9.11 Scenarios and use cases

| Diagram                                                  | Use cases     | Requirements shown most directly                              |
| -------------------------------------------------------- | ------------- | ------------------------------------------------------------- |
| 9.2 Build a team and read its analysis                   | UC1, UC5, UC6 | REQ-TEAM-2, REQ-TEAM-14, REQ-ANLY-5, REQ-COLL-1, REQ-LINK-1   |
| 9.3 Share a team and open the link                       | UC11, UC12    | REQ-LINK-2, REQ-LINK-4 to REQ-LINK-8                          |
| 9.4 Change a team's generation                           | UC7           | REQ-GEN-5 to REQ-GEN-8                                        |
| 9.5 Send feedback                                        | UC18          | REQ-FEED-1, REQ-FEED-6, REQ-FEED-7, REQ-SEC-1 to REQ-SEC-3    |
| 9.6 Two tabs keep the same saved teams                   | UC8           | REQ-COLL-11, REQ-INFO-5                                       |
| 9.7 Update game data                                     | UC20, UC21    | REQ-DATA-1, REQ-DATA-6 to REQ-DATA-12, REQ-MAINT-1, REQ-OPS-1 |
| 9.8 Judge the Spinner/Defogger role (planned)            | UC22          | REQ-ANLY-14 to REQ-ANLY-16                                    |
| 9.9 Take the current team to the other version (planned) | UC19, UC23    | REQ-SITE-2, REQ-SITE-3                                        |
