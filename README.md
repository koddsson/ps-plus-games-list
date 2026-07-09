# ps-plus-games-list

Daily-synced snapshots of the [PlayStation Plus](https://www.playstation.com/en-us/ps-plus/) games catalog.

A scheduled GitHub Actions job fetches the public PlayStation "gameslist"
endpoints once a day and commits the results to [`data/`](./data). Because the
job only commits when something actually changed, the git history becomes a
log of catalog additions and removals over time.

## This month's games

The table below is regenerated from `data/plus-monthly-games-list.json` on each
sync, so it always reflects the current monthly line-up.

<!-- BEGIN MONTHLY GAMES -->

| Cover | Game | Platforms | Genre |
| --- | --- | --- | --- |
| <a href="https://store.playstation.com/en-us/concept/10011645"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202407/0320/eb64ea35178d0f00577698a1b99ea3e91dca797a9dc21201.png" width="120" alt="Call of Duty®: Modern Warfare® III - Cross-Gen Bundle"></a> | [Call of Duty®: Modern Warfare® III - Cross-Gen Bundle](https://store.playstation.com/en-us/concept/10011645) | PS4, PS5 | Action |
| <a href="https://store.playstation.com/en-us/concept/233619"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202006/1809/jLA6HPdLEXZjR8zv6BiHf7l0.png" width="120" alt="CrossCode"></a> | [CrossCode](https://store.playstation.com/en-us/concept/233619) | PS4, PS5 | Role Playing Games, Puzzle |
| <a href="https://store.playstation.com/en-us/concept/10011010"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202411/1911/ad09aae201d797cc0c435475c33787bde37543acbd101873.png" width="120" alt="For The King II"></a> | [For The King II](https://store.playstation.com/en-us/concept/10011010) | PS5, PS4 | Strategy, Adventure, Role Playing Games |

<!-- END MONTHLY GAMES -->

## Tracked categories

| File | Category | Source |
| --- | --- | --- |
| `data/plus-monthly-games-list.json` | Monthly games | [`plus-monthly-games-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-monthly-games-list) |
| `data/plus-classics-list.json` | Classics catalog | [`plus-classics-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-classics-list) |
| `data/plus-games-list.json` | Games catalog | [`plus-games-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-games-list) |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how the sync works and how to run
it locally.
