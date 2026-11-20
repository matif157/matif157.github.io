// Pull live GitHub data at build time into src/data/github.json.
// Runs as `prebuild`, so every deploy refreshes the numbers. If the network
// or the API rate limit gets in the way we keep the previous snapshot and let
// the build continue — the site also refreshes this data in the browser.
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { summariseRepos } from '../src/lib/github.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = resolve(root, 'src/data/github.json')
const USER = 'matif157'
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'matif157-portfolio-build',
}

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.json()
}

async function main() {
  const [user, repos] = await Promise.all([
    get(`/users/${USER}`),
    get(`/users/${USER}/repos?per_page=100&sort=pushed`),
  ])

  const data = {
    syncedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      createdAt: user.created_at,
    },
    ...summariseRepos(repos),
  }

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, `${JSON.stringify(data, null, 2)}\n`)
  console.log(
    `[github] ${data.totals.publicRepos} repos · ${data.totals.languages} languages · ${data.activity.length} recent`,
  )
}

main().catch((error) => {
  const fallback = existsSync(outFile) ? 'using previous snapshot' : 'no snapshot available'
  console.warn(`[github] skipped: ${error.message} (${fallback})`)
  process.exit(0)
})
