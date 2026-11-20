# matif157.github.io

Personal portfolio for **Muhammad Atif — CRM & Business Software Developer**.

The v2 rebuild presents skills and work the way a model router presents models. The hero is an OpenRouter-style network graph: an MA link mark at the centre, AI models and disciplines around it, and every project, tool, language and live data point branching out. Hover or tap a node to trace its route back to MA. Content is real: GitHub data is fetched from the public API, LinkedIn activity is curated and dated.

Live at **https://matif157.github.io** — deployed from the `docs/` folder via GitHub Pages.

## Stack

- React 18 + Vite 5, no runtime UI dependencies
- Inline `<svg>` network graph (radial hubs, curved routes, interactive route highlighting)
- Plus Jakarta Sans · JetBrains Mono (Google Fonts)
- GitHub Pages hosting (source: `main` branch → `/docs`)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # refreshes GitHub data, compiles into docs/
npm run preview  # preview the production build
```

`prebuild` runs `scripts/fetch-github.mjs`, which writes `src/data/github.json` from the public GitHub API. If the API fails or is rate-limited, the previous snapshot is kept and the build continues.

## Structure

```
src/
  data/portfolio.js     ← profile, hero copy, skills-as-models, work, contact
  data/github.json      ← generated build-time GitHub snapshot (user, totals, repos, activity)
  data/activity.json    ← curated LinkedIn posts, certification, follower count
  data/graph.js         ← network content: hubs, leaves, links, live numbers
  lib/github.js         ← shared GitHub shaping, relative time, language colours
  components/
    NetworkGraph.jsx    ← MA-centred network with hover/tap route tracing
    SunMark.jsx         ← sun logo (nav, footer)
    Hero.jsx            ← headline, network graph, stats strip, marquee
    Models.jsx          ← skills as filterable model cards
    Work.jsx            ← project cards with live/repo status
    GitHubLive.jsx      ← profile panel, recently-pushed feed, repo grid
    Activity.jsx        ← LinkedIn posts + HubSpot credential
    Contact.jsx / Footer.jsx / Navbar.jsx / Reveal.jsx
scripts/fetch-github.mjs ← prebuild GitHub fetcher
public/                  ← resume PDF/DOCX, sun.svg, icons, og image
docs/                    ← build output served by GitHub Pages
```

## Live data notes

- **GitHub** — genuinely live: a build snapshot in `src/data/github.json`, refreshed in the browser from `api.github.com` on every visit. No token used.
- **LinkedIn** — LinkedIn has no public activity API. `src/data/activity.json` is synced by hand, labelled with a sync date, and every card links back to the real profile/post.

## History

- `v1-axfolio` tag — the previous AxFolio-theme build (dark ink + ember + cream, particle field, preloader, tabbed panels).
