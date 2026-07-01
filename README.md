# ps-plus-games-list

Daily-synced snapshots of the [PlayStation Plus](https://www.playstation.com/en-us/ps-plus/) games catalog.

A scheduled GitHub Actions job fetches the public PlayStation "gameslist"
endpoints once a day and commits the results to [`data/`](./data). Because the
job only commits when something actually changed, the git history becomes a
log of catalog additions and removals over time.

## Tracked categories

| File | Category | Source |
| --- | --- | --- |
| `data/plus-monthly-games-list.json` | Monthly games | [`plus-monthly-games-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-monthly-games-list) |
| `data/plus-classics-list.json` | Classics catalog | [`plus-classics-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-classics-list) |
| `data/plus-games-list.json` | Games catalog | [`plus-games-list`](https://www.playstation.com/bin/imagic/gameslist?locale=en-us&categoryList=plus-games-list) |

## How it works

1. `.github/workflows/update-games.yml` runs daily at 08:00 UTC (and can be
   triggered manually via **Run workflow**).
2. It runs `node scripts/fetch-games.mjs`, which fetches each category and
   writes it to `data/<category>.json`.
3. Object keys are sorted recursively so the committed JSON is deterministic
   and diffs reflect real catalog changes rather than key reordering.
4. If any file changed, the workflow commits and pushes the update.

## Running locally

Requires Node.js 18+ (uses the built-in `fetch`, no dependencies).

```sh
npm run fetch
# or
node scripts/fetch-games.mjs
```

Set `PS_LOCALE` to fetch a different locale (defaults to `en-us`):

```sh
PS_LOCALE=en-gb node scripts/fetch-games.mjs
```
