# Deferred work

The current bug-fix scope excludes new features. Record bugs whose complete resolution needs new product behavior here, and leave them open until that feature work is explicitly requested.

## Team checklist battle format

- [ ] Correct historical Defog checks with an explicit singles or doubles context.

Deferred on October 11, 2026 because a complete fix needs the checklist to know the team's battle format. The current format filter narrows Pokemon choices; it does not establish an independent battle format for the checklist. A new checklist toggle or a team format setting are possible approaches, with the UI decision left for future work.

**Known bug:** the current checklist excludes Defog from hazard removal before Gen 6. In Gen 4–5 singles, Defog clears hazards from the opponent's side. In doubles, targeting a teammate can clear the user's side, so excluding it in every format produces an incorrect result. [Historical move rules](https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/mods/gen5/moves.ts).

Future work should:

- Establish the team's singles or doubles context without inferring it from generation or a Pokemon filter.
- Explain conditional behavior when the battle format is unspecified.
- Verify Gen 4–5 singles and doubles separately, and preserve Defog's hazard-removal classification from Gen 6 onward.
- Preserve existing saved teams and share links, including those with no battle format specified.

Adding doubles support roles such as redirection or ally healing would be separate feature work, not part of the Defog correction. This item remains deferred and unresolved; no application behavior was changed when recording it.
