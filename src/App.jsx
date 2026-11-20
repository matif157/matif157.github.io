import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Models from './components/Models'
import Work from './components/Work'
import GitHubLive from './components/GitHubLive'
import Activity from './components/Activity'
import Contact from './components/Contact'
import Footer from './components/Footer'
import githubSeed from './data/github.json'
import { summariseRepos } from './lib/github'

const USER = 'matif157'
const API = 'https://api.github.com'

export default function App() {
  const [github, setGithub] = useState(githubSeed)

  // The build ships a snapshot; this refreshes it from the public API so the
  // numbers, repositories and recent pushes are live on every visit.
  useEffect(() => {
    let alive = true
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 9000)

    async function refresh() {
      try {
        const response = await fetch(`${API}/users/${USER}/repos?per_page=100&sort=pushed`, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        })

        if (!alive || !response.ok) return

        const repos = await response.json()
        const summary = summariseRepos(repos)

        if (!alive) return
        setGithub((previous) => ({
          ...previous,
          ...summary,
          syncedAt: new Date().toISOString(),
        }))
      } catch {
        // Rate limit or offline: keep the build snapshot on screen.
      } finally {
        window.clearTimeout(timer)
      }
    }

    refresh()

    return () => {
      alive = false
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="site" id="top">
      <Navbar />
      <main>
        <Hero github={github} />
        <Models />
        <Work github={github} />
        <GitHubLive github={github} />
        <Activity />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
