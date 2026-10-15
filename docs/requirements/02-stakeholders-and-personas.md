# 2. Stakeholders and Personas

Who has a stake in My Pokemon Team, how its players differ, and two personas drawn from the feedback players have sent ([12-feedback-analysis.md](12-feedback-analysis.md)).

## 2.1 Stakeholders

- **SH-1 Player.** Anyone who builds or studies a team on the site, including a Link Recipient, who opens a share link someone else made. Players are the reason the site exists and the source of its advertising revenue.
- **SH-2 Maintainer.** Whoever runs the data and translation updates, deploys, and answers feedback. Today this is the Site Owner.
- **SH-4 Email delivery service.** Resend, which delivers feedback to the Site Owner.
- **SH-6 Site Owner.** Jeffery Tang, who made the site in 2019, runs it alone, pays for it, and receives its advertising revenue. He has the last say on what the site does, puts what helps players first, and wants it to be the teambuilder non-competitive players reach for (BR-9). His decisions and reasons are in [08-assumptions-and-interview.md](08-assumptions-and-interview.md).
- **SH-11 Pokemon Showdown and Smogon.** Their simulator supplies the site's data, sprites, team text format, and tiers. A change on their side can break the site.
- **SH-12 PokeAPI.** Supplies the names in each language.
- **SH-13 Playwire and its advertisers.** Playwire runs the site's advertising, pays the Site Owner, and sets rules for ad placement, `ads.txt`, and crawlers.

Missing numbers belonged to stakeholders that were removed; they are not reused.

## 2.2 How players differ

- **Most are not competitive.** Most players who write in plan a team for a playthrough, a fan-made game, characters of their own, or fun, and competitive terms such as "OU" mean nothing to them. Competitive singles and doubles players use the site too, and they notice a single wrong matchup. The Site Owner puts the non-competitive players first (BR-9).
- **Many are young.** The Site Owner believes children and teenagers are a large part of the audience **[A-24]**, and several feedback emails come from school addresses. That is why he wants features kept simple and results in plain words.
- **Device.** Phones from 320 pixels wide, often used one-handed; tablets; laptops and desktops with a keyboard.
- **Language.** Any of the site's ten languages, often not English.
- **Generation.** The current games, an older generation with different rules, or favourite pokemon from every generation in one team. A choice of one game that suits a competitive player can stop a non-competitive one from building the team they want.
- **Old links.** Some come from the old website with bookmarked team links.
- **Access needs.** Keyboard-only and screen reader users, and users who need the dark colour scheme or larger touch targets.

## 2.3 Personas

Each persona is made up, but drawn from what players wrote in. P-2 to P-4, a competitive singles player, a doubles player, and a returning player of the older games, were dropped because the feedback gave them little or no support ([12, Section 12.4](12-feedback-analysis.md#124-effect-on-the-personas)).

### P-1 Maya / planning her next playthrough on the bus

> "I just want to know if my team has a giant hole in it before I get to the Elite Four."

Maya is 19 and studies nursing in Winnipeg. She has played every main Pokemon game since Black and White on a handheld, always on her own, and she is replaying HeartGold between classes. She knows the type chart by heart, but she has never played online and words such as "phazer" or "OU" mean nothing to her. She picks pokemon she likes first and worries about balance second, and she enjoys the planning as much as the playing. She uses her phone for almost everything, usually one-handed on the bus with patchy data, and she closes any site that makes her read instructions.

Typical activities:

- Picking six pokemon for an in-game playthrough, by name or by browsing sprites.
- Checking which types hit her team hardest.
- Looking up where a pokemon is from and what it is weak to.
- Sending the team to a friend who is playing the same game.

Goals:

- See her team's worst weaknesses at a glance, on a phone.
- Limit the choice to pokemon that exist in the game she is playing.
- Come back tomorrow and find the team still there.

Pain points:

- Competitive jargon with no explanation.
- Inputs too small to tap, and lists of a thousand names to scroll through.
- Losing a team because she closed the tab.

### P-5 Leo / building a dream team for a game that is not on the list

> "Eu só quero juntar os meus favoritos. Por que o site não deixa?"

Leo is 14 and in his first year of secondary school in Curitiba. He plays a fan-made Pokemon game on the family computer, one that is built on an older generation and adds pokemon from newer ones, and he also makes teams for characters he invents with his friends. He has never played a ranked battle and does not know what a tier is. He picks pokemon because he likes them, from any game, without rules he did not ask for, and he wants to see them: a pokemon with no picture looks broken to him. He reads English slowly and uses the site in Portuguese. When something is missing or a list will not let him pick what he wants, he either writes to the owner or leaves.

Typical activities:

- Putting his favourite pokemon from several generations into one team.
- Building a team for a fan-made game whose pokemon list matches no official game.
- Checking that the newest pokemon and mega evolutions are there, and what they look like.
- Tapping the random button to see what comes up.

Goals:

- Any pokemon, whatever game it is from, in the same team.
- A picture for every pokemon and forme.
- New pokemon and formes on the site as soon as they exist.

Pain points:

- A game or generation choice that hides the pokemon he wants.
- Missing sprites and icons.
- Waiting weeks for new mega evolutions to be added.
