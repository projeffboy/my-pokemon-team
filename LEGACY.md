# Legacy site

This branch preserves the site from commit `ca23d6b55ea96d9bf37022c094f6945d8e6420d3`, with a prominent New site button and a confirmation when a team is open. It is deployed independently at https://old.mypokemonteam.com/ and links back to https://mypokemonteam.com/.

Switching does not transfer a team. This version does not persist saved-team collections; keep a team's existing share link before leaving. Team transfer is future work in [issue #111](https://github.com/projeffboy/my-pokemon-team/issues/111).

Keep this branch separate from `master` so new-site releases do not change the legacy site. Changes to the legacy deployment should stay limited to maintaining its access and operation.
