# Contributing

## How it works

1. `.github/workflows/update-games.yml` runs daily at 08:00 UTC (and can be
   triggered manually via **Run workflow**).
2. It runs `node scripts/fetch-games.mjs`, which fetches each category and
   writes it to `data/<category>.json`.
3. Object keys are sorted recursively so the committed JSON is deterministic
   and diffs reflect real catalog changes rather than key reordering.
4. The script also refreshes the "This month's games" table in the README,
   between the `MONTHLY GAMES` marker comments, from
   `data/plus-monthly-games-list.json`. No timestamp is written, so the README
   only changes when the line-up changes.
5. If `data/` or `README.md` changed, the workflow commits and pushes the
   update. Because it commits only on change, the git history becomes a log of
   catalog additions and removals over time.

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

## Adding a category

Add the category slug to the `CATEGORIES` array in
[`scripts/fetch-games.mjs`](./scripts/fetch-games.mjs); it will be written to
`data/<slug>.json` on the next run. To feature a category's games in the README
table instead of the monthly list, point `MONTHLY_CATEGORY` at it.
