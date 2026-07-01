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
| <a href="https://store.playstation.com/en-us/concept/10008048"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202404/1120/64a12b89992b8e34ecace3e5c7d1d39b954c2ab1d73de70a.png" width="120" alt="Grounded PS4® &amp; PS5®"></a> | [Grounded PS4® & PS5®](https://store.playstation.com/en-us/concept/10008048) | PS4, PS5 | Adventure |
| <a href="https://store.playstation.com/en-us/concept/10008091"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202308/1614/1055968351b6dce7f43579788b031e590a3d2c62600c177e.png" width="120" alt="Nickelodeon All-Star Brawl 2"></a> | [Nickelodeon All-Star Brawl 2](https://store.playstation.com/en-us/concept/10008091) | PS4, PS5 | Fighting |
| <a href="https://store.playstation.com/en-us/concept/10010263"><img src="https://image.api.playstation.com/vulcan/ap/rnd/202409/1318/c955588303d70c85f6cc2d5aed46c096c4d6c4b34187d0d6.png" width="120" alt="Warhammer 40,000: Darktide"></a> | [Warhammer 40,000: Darktide](https://store.playstation.com/en-us/concept/10010263) | PS5 | Action |

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
