// The hero network: MA at the centre, AI models and disciplines around it,
// with every project, tool, language and live data point branching out.
// Kept separate from the graph renderer so the content is easy to edit.
import { profile, socials, work } from './portfolio'

const byTitle = (title) => work.find((item) => item.title.includes(title))

const hub = (id, label, kind, color, detail, leaves) => ({
  id,
  label,
  kind,
  color,
  detail,
  leaves,
})

export function buildGraph(github) {
  const publicRepos = github?.totals?.publicRepos ?? 10
  const totalRepos = profile.totalRepos
  const followers = github?.user?.followers ?? 0

  const snooker = byTitle('Asif Snooker Club')
  const gulf = byTitle('Odoo Gulf')
  const membership = byTitle('Odoo Club Membership')
  const assistant = byTitle('Atif Assistant')
  const jarvis = byTitle('Jarvis')
  const syed = byTitle('Syed Professional')
  const gravity = byTitle('Gravity CRM')
  const corpus = byTitle('Portfolio')

  const hubList = [
    hub('chatgpt', 'ChatGPT', 'AI model', '#b18cff',
      'An everyday reasoning model I design around — prompt systems, agents and assistant workflows.',
      [
        { label: 'Atif Assistant', detail: 'Reality Engine, persistent memory and Challenge Mode.', href: assistant?.repo },
        { label: 'Jarvis', detail: 'A small local-first assistant for capture, recall and automations.', href: jarvis?.repo },
        { label: 'LLM Hooks', detail: 'Model calls wired into day-to-day CRM workflows.' },
      ]),

    hub('gemini', 'Gemini', 'AI model', '#4d8dff',
      'A multimodal model for local-first experiments, recall and pattern detection.',
      [
        { label: 'Local-first AI', detail: 'Runs close to the data, no black-box dependency.' },
        { label: 'Persistent Memory', detail: 'Context that survives across sessions.' },
        { label: 'Pattern Radar', detail: 'Finds recurring themes in captured notes.' },
      ]),

    hub('claude', 'Claude AI', 'AI model', '#ffab00',
      'Coding and review partner — the model behind the agent workflows I ship.',
      [
        { label: 'Coding Agents', detail: 'Repo-wide changes, tests and review loops.' },
        { label: 'Prompt Design', detail: 'Reusable instructions for repeatable output.' },
        { label: 'RevOps Notes', detail: 'HubSpot Revenue Operations research and notes.' },
      ]),

    hub('odoo', 'Odoo 19', 'Platform', '#34dfaa',
      'ERP and CRM modules built to pass an audit — billing, QR and e-invoice XML.',
      [
        { label: 'Gulf E-Invoicing', detail: 'ZATCA QR and UBL 2.1 XML for Saudi Arabia.', href: gulf?.repo },
        { label: 'Club Membership', detail: 'Recurring memberships, renewals and overlap protection.', href: membership?.repo },
        { label: 'ZATCA QR', detail: 'Phase 1 QR codes on invoices.' },
        { label: 'UBL 2.1', detail: 'Structured e-invoice XML.' },
      ]),

    hub('projects', 'Projects', 'Deployments', '#c8ff00',
      'Production systems and open-source modules — the work this network exists to deliver.',
      [
        { label: 'Snooker Club CRM', detail: 'Live demo with sample data at snooker.site.je.', href: snooker?.live },
        { label: 'Syed CRM', detail: 'Installer-driven professional-services CRM.', href: syed ? `mailto:${profile.email}?subject=${encodeURIComponent('Access request — Syed Professional CRM')}` : null },
        { label: 'Gravity CRM', detail: 'Clients, projects, tasks, invoicing and AI hooks.', href: gravity ? `mailto:${profile.email}?subject=${encodeURIComponent('Access request — Gravity CRM')}` : null },
        { label: 'Billing Engine', detail: 'Peak and night rate bands with collection tracking.' },
      ]),

    hub('tools', 'Tools', 'Tooling', '#4d8dff',
      'The services that keep the work visible, deployable and reachable.',
      [
        { label: 'GitHub', detail: 'Source, issues and commit history.', href: socials.find((s) => s.label === 'GitHub')?.url },
        { label: 'LinkedIn', detail: 'Posts, credentials and professional activity.', href: socials.find((s) => s.label === 'LinkedIn')?.url },
        { label: 'WhatsApp API', detail: 'Reminders and payment follow-ups.' },
        { label: 'HubSpot', detail: 'Revenue Operations certification.' },
        { label: 'Upwork', detail: 'Client engagements worldwide.', href: socials.find((s) => s.label === 'Upwork')?.url },
      ]),

    hub('stack', 'Languages', 'Stack', '#34dfaa',
      'The day-to-day stack: PHP and MySQL at the core, Python and JavaScript around it.',
      [
        { label: 'PHP 8', detail: 'Service layers, PDO and prepared queries.' },
        { label: 'MySQL', detail: 'Indexed schemas and reporting queries.' },
        { label: 'Python', detail: 'Odoo modules and local-first agents.' },
        { label: 'JavaScript', detail: 'Live tables, dashboards and UI state.' },
        { label: 'React', detail: 'Interfaces, including this site.' },
        { label: 'Docker', detail: 'Repeatable local and production setups.' },
      ]),

    hub('data', 'Live Data', 'Data', '#ffab00',
      'Numbers pulled from GitHub and LinkedIn — no invented metrics.',
      [
        { label: `${totalRepos} Repositories`, detail: 'Total repositories across public and private builds.' },
        { label: `${publicRepos} Public`, detail: 'Public repositories refreshed from the GitHub API.' },
        { label: `${profile.crmCodebases} CRM Bases`, detail: 'CRM codebases in the portfolio corpus.', href: corpus?.repo },
        { label: `${followers} Followers`, detail: 'GitHub followers on the live profile.' },
      ]),
  ]

  // Give every leaf a stable id and its hub as parent for route highlighting.
  const nodes = [{ id: 'ma', label: 'MA', kind: 'You', color: '#c8ff00', parent: null }]
  for (const item of hubList) {
    nodes.push({ ...item, parent: 'ma' })
    item.leaves.forEach((leaf, index) => {
      nodes.push({
        ...leaf,
        id: `${item.id}-${index}`,
        kind: item.kind,
        color: item.color,
        parent: item.id,
      })
    })
  }

  return { nodes, hubs: hubList }
}

export default buildGraph
