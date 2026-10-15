# 8. Owner's Decisions and Open Questions

These documents were first written from the repository alone. The Site Owner then answered an interview in writing on 13 October 2026 and reviewed the documents on 13 and 14 October. This page keeps the decisions he made and his reasons, in his own words where he wrote them, and lists what is still open. Whether a decision has been built, and when it will be, is tracked in the GitHub issues.

## 8.1 Decisions and why

### Purpose and money

- **Why the site exists.** He made it in 2019 because good teambuilders were lacking; the best known one besides Showdown's was barebones and inaccurate. He would be proud of it in a year "if this site was fully fleshed out, with features like team, language, and full generation support, etc., and it managed to cover a huge chunk of the non-competitive community." (BR-9)
- **Advertising should pay for his time too.** "It should cover costs and earn income to cover the time that I spend building and maintaining this site." He chose to leave the rate open. (BR-1)
- **How to tell the redesign has won.** All four signs count: few players switch back to the old website, feedback about defects quiets down, traffic and ad revenue hold, and everything the old website did works on the redesign and has a test. (BR-5)
- **One real worry.** "Nothing worries me too much. Except the Pokemon Company or Nintendo etc. taking the site down, but they haven't done anything to similar sites." (RISK-8)
- **One person.** "For the moment, this is a one-man project", so there is nobody else to consult apart from the players who write in.

### What the site does and does not do

- **Soft wording for what is left out.** "Never is a strong word and can hinder adaptation." What the site does not plan to do is "not part of the plan" or "not intended", not "never". Battles and damage calculation, and accounts with teams stored online, are not part of the plan.
- **No backend unless it is needed.** "Preferably no backend. But if it was necessary for the site, either for its survival or new extremely important features require it, then I can reconsider." (BR-6)
- **Players usually win over upkeep.** When a feature helps players but makes the site harder to maintain, helping players usually wins. Upkeep wins sometimes, "like with the backend and that kind of stuff", because a site that is hard to maintain is harder to improve.
- **Smarter features later, and kept simple.** Suggestions, deeper analysis, and a usage chart are wanted for a later release, but: "I don't want to try to make the site too intelligent. I think my user base is a lot of kids and teenagers."
- **Show a team's problems.** The site should show the rules a team breaks, and tell players when a link or a saved team lost an entry to a data update.
- **Team backups stay.** The site keeps its Team backups action and its backup file. A change to fold them into Export All and Import Team (issue 148) was closed as not planned on 14 October 2026.
- **Feedback can be anonymous.** Players must be able to send feedback without an email address; the form already says an email is only needed for a reply. Sending from the site's own domain would look more professional, but it is not wanted, because players would see no difference.

### Data and fixes

- **Major data within 2 days.** For a new game or a new Pokemon Champions format: "ASAP. As soon as Showdown gets the data we need to be using it. If Showdown is too slow find other sources. No more than 2 days." (BR-3)
- **Minor data and wrong results within a week.** For something like one pokemon losing a move: "still important but no more than a week." A reported wrong result has the same priority: "if those are fixed in a week, that's okay by me." (BR-3, BR-7)
- **The Maintainer hears of data changes automatically**, so that the 2-day target can be met. He approved this with issue 116.

### Speed and browsers

- **Speed first.** "Speed is extremely important. The site has to be fast. No question about it." He gave no figures. The random button exists so that one tap gives an analysed team.
- **Browsers by usage.** "Which other browsers we should support should be determined by their market share / browser usage. However, this does not mean that we should support IE11 if it still has a lot of people using it, because we do not want to support very old legacy browsers."

### The old website

- **The old website is in maintenance mode.** "Only carrying the current team is enough. We don't want to add features to the old site unless it's deemed absolutely necessary. The old site should just be in maintenance mode." So the current team goes to the old website only, nothing comes back, and saved teams do not cross.
- **The team crosses as a share link**, and before leaving, the player is told which pokemon and details the old website cannot hold. He approved this with issue 111.

### Screens and editing

These came from his review of the site on 14 October 2026.

- **The toolbar is about the team on screen.** Importing another team belongs behind the Teams button, which holds every action on other teams. The Advanced switch was removed, so every function is always shown. He chose to turn the Manage button into a More button with two sections, Manage team and Accessibility, where Accessibility has switches to stop animated sprites and to hide pokemon and move types. Where the toolbar fits on one row, Clear gets its own button.
- **Buttons have text labels.** Every button needs a text label, except the die and the info button on a slot's sprite, which must not cover the sprite. Where a labelled button is too wide, the site is wrong, not the rule. Issue 146, which held this and the sprite rule, was closed as not planned on 14 October 2026, so both are proposals again (REQ-USE-11 and 12).
- **Nothing is cut off at 320 pixels.** The type chart's tabs did not all fit on a 320 pixel screen; no control or label may be cut off.
- **Phones.** Focusing a field on a phone should not bring up saved passwords, cards, addresses, contacts, or similar autofill. "closing the dropdown menu should also cause the keyboard to close as well (e.g. on a phone)".
- **Team text is kept as typed.** Fields for team data and Showdown text get no spellcheck, automatic correction, or capitals, and a dialog's buttons stay in view while its content scrolls. He objected to disabling Save until something is edited.
- **Team text problems are advice, not a block.** Updating a team from its text applies whatever could be read, including empty slots for moves that were not recognized, and explains the problems instead of refusing the update. A problem is named by pokemon and field, such as "Ho-Oh, move 4", not by line: "mentioning line 6 is essentially useless because there's no line numbers on this."

### How work is tracked

- **Tasks live on GitHub only.** Tasks, their ratings, and their priority are kept in the issues and on the project board, not in these documents. An issue in a release milestone approves its requirements; an issue with no milestone is ranked but not scheduled.
- **Follow the ranking.** "Well, whatever ranks first, right?" Planned work is done in the order the board's ratings give. He does not rate the items himself, and the formula stays simple, because working every priority out again whenever a task is added was a burden.
- **Every task has acceptance criteria**, so that "done" can be checked rather than guessed.
- **No player survey or usability sessions for now.** "we can do those another time. Could be useful in the future if we want to gauge who our audience is." They could then measure how quickly a first-time player finds the team's worst weakness, how quickly a Showdown user imports a team and copies it back, and how many players rate the site good.
- **Smaller calls.** Wish together with Protect or Detect counts as reliable recovery. A trapper is a pokemon that keeps foes from switching out for as long as it stays in, with a move like Mean Look or an ability like Shadow Tag; moves that trap for a few turns, like Whirlpool, do not count. Shrinking the inputs' clear button is not part of the plan.

## 8.2 Open questions

Text marked **[A-n]** in the other documents rests on one of these.

| ID   | Open question                                                                                                                                            | Where                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| A-2  | What hourly rate, for how many hours, should advertising pay for? Left open by the Site Owner's choice.                                                  | BR-1                          |
| A-3  | How late must Pokemon Showdown be with a new game's data before another source is used, and which source? 7 days is proposed.                            | BR-3, issue 123               |
| A-4  | What thresholds show that the redesign has won? Fewer than 10% of sessions switching back, and fewer than five defect reports a month, are proposed.     | BR-5                          |
| A-16 | What figures should the usability, performance, and uptime requirements use? The Site Owner rated speed as paramount and gave none, so 05 proposes them. | 05 Sections 3.2, 3.3, and 3.5 |
| A-18 | What share of browser usage makes a browser worth supporting? 2% is proposed.                                                                            | REQ-INTF-13, issue 121        |
| A-23 | How should "a large share" of non-competitive players be measured, such as by monthly users or search position?                                          | BR-9                          |
| A-24 | Are children and teenagers a large part of the audience, as the Site Owner believes? Analytics could check.                                              | 01 Scope, 02                  |
