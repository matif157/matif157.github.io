// Shared shaping helpers for GitHub data.
// Used at build time (scripts/fetch-github.mjs) and in the browser, where the
// GitHub section refreshes itself from the public API after hydration.

export const LANG_COLORS = {
  Python: '#3572a5',
  PHP: '#4f5d95',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Vue: '#41b883',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
}

export const languageColor = (name) => LANG_COLORS[name] || '#8b949e'

export function summariseRepos(repos) {
  const sorted = [...repos].sort(
    (a, b) => new Date(b.pushed_at || b.pushedAt) - new Date(a.pushed_at || a.pushedAt),
  )

  const languages = {}
  for (const repo of sorted) {
    if (!repo.language) continue
    const entry = languages[repo.language] || { count: 0, bytes: 0 }
    entry.count += 1
    entry.bytes += repo.size || 0
    languages[repo.language] = entry
  }

  const totalWithLanguage = sorted.filter((repo) => repo.language).length || 1
  const languageList = Object.entries(languages)
    .map(([name, l]) => ({
      name,
      repos: l.count,
      share: Math.round((l.count / totalWithLanguage) * 1000) / 10,
    }))
    .sort((a, b) => b.repos - a.repos || b.share - a.share)

  const mapped = sorted.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count ?? r.stars ?? 0,
    forks: r.forks_count ?? r.forks ?? 0,
    size: r.size ?? 0,
    url: r.html_url ?? r.url,
    homepage: r.homepage ?? null,
    topics: r.topics || [],
    pushedAt: r.pushed_at ?? r.pushedAt,
    updatedAt: r.updated_at ?? r.updatedAt,
    createdAt: r.created_at ?? r.createdAt,
  }))

  const activity = mapped
    .filter((repo) => repo.pushedAt)
    .slice(0, 8)
    .map((repo) => ({
      id: `repo-${repo.name}`,
      repo: repo.name,
      message: repo.description || 'Repository updated',
      at: repo.pushedAt,
    }))

  return {
    totals: {
      publicRepos: mapped.length,
      stars: mapped.reduce((n, r) => n + r.stars, 0),
      forks: mapped.reduce((n, r) => n + r.forks, 0),
      languages: languageList.length,
    },
    languages: languageList,
    repos: mapped,
    activity,
  }
}

export function relativeTime(iso, now = Date.now()) {
  if (!iso) return '—'
  const diff = Math.max(0, now - new Date(iso).getTime())
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
