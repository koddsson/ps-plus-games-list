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
| <a href="https://store.playstation.com/en-us/concept/10017189"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202602/0421/fe1c88d7fe0aecfb99948e04096ed2e59479d65add3044e7.png" width="120" alt="Big Walk"></a> | [Big Walk](https://store.playstation.com/en-us/concept/10017189) | PS5 | Adventure |
| <a href="https://store.playstation.com/en-us/concept/232374"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202501/3115/3c17bf3bb4c9b5b572f69217554f0afdebade3a37959bac3.png" width="120" alt="Dying Light 2 Stay Human PS4&amp;PS5"></a> | [Dying Light 2 Stay Human PS4&PS5](https://store.playstation.com/en-us/concept/232374) | PS4, PS5 | Unique |
| <a href="https://store.playstation.com/en-us/concept/10005369"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202209/1922/a4qh6rFTIYn8HJ6hQjwoI4ZC.png" width="120" alt="SIGNALIS"></a> | [SIGNALIS](https://store.playstation.com/en-us/concept/10005369) | PS4 | Horror, Adventure |

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
