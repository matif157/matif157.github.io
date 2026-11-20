// All site content lives here. Edit this file to update the portfolio.
const base = import.meta.env.BASE_URL

export const profile = {
  name: 'Muhammad Atif',
  handle: 'matif157',
  role: 'CRM & Business Software Developer',
  headline: 'CRM specialist',
  location: 'Faisalabad, Pakistan',
  timezone: 'PKT · UTC+5',
  email: 'matifzahoor1577@gmail.com',
  phone: '+92 346 7560172',
  company: 'Atif Systems',
  companyUrl: 'https://www.linkedin.com/company/145416309',
  joined: '2023',
  availability: 'Open to new projects',
  since: '2024',
  // Live GitHub numbers are injected from src/data/github.json at runtime.
  totalRepos: 40,
  productionSystems: 8,
  crmCodebases: 22,
  resume: {
    pdf: `${base}Muhammad-Atif-CRM-Software-Developer-Resume-v4.pdf`,
    docx: `${base}Muhammad-Atif-Branded-Resume.docx`,
  },
}

export const socials = [
  { label: 'GitHub', url: 'https://github.com/matif157' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-atif-932824287' },
  { label: 'X / Twitter', url: 'https://x.com/MatifZahoo93222' },
  { label: 'Upwork', url: 'https://www.upwork.com/freelancers/~01768e0539e2882c67' },
  { label: 'WhatsApp', url: 'https://wa.me/923467560172' },
]

export const hero = {
  badge: 'Available for work',
  title: ['One developer.', 'Many models.'],
  accentLine: 1,
  sub: 'I build the systems a business actually runs on — PHP & MySQL CRMs, billing engines, Odoo 19 modules and local-first AI. Every discipline below is a model I run in production.',
  meta: ['Faisalabad, PK', 'Working worldwide', 'Shipping since 2023'],
}

export const marquee = [
  'PHP 8',
  'MySQL',
  'JavaScript',
  'React',
  'Python',
  'Odoo 19',
  'Alpine.js',
  'Tailwind',
  'Chart.js',
  'Docker',
  'WhatsApp API',
  'Twilio',
  'REST',
  'Linux',
  'Git',
]

// Skills, presented the way OpenRouter presents models.
// `accent` drives the card glow; `category` drives the filter tabs.
export const skills = [
  {
    id: 'php-core',
    name: 'PHP Core',
    model: 'atif/php-core',
    category: 'Backend',
    accent: '#c8ff00',
    desc: 'The engine room. PHP 8 on MySQL with prepared statements, indexed reporting queries and service layers that hold up at the end of a long shift.',
    chips: ['PHP 8', 'MySQL', 'PDO', 'REST', 'Laravel'],
    meta: [
      ['Tier', 'Core'],
      ['In prod', '22 codebases'],
    ],
  },
  {
    id: 'interface',
    name: 'Interface',
    model: 'atif/interface',
    category: 'Frontend',
    accent: '#4d8dff',
    desc: 'Dashboards staff can run without a manual — live tables, billing screens, charted P&L and mobile-first layouts that survive a busy counter.',
    chips: ['JavaScript', 'Alpine.js', 'Tailwind', 'Chart.js', 'CSS'],
    meta: [
      ['Tier', 'Daily driver'],
      ['In prod', '8 systems'],
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    model: 'atif/automation',
    category: 'Automation',
    accent: '#34dfaa',
    desc: 'Rate engines with peak and night bands, scheduled reminders, WhatsApp follow-ups, backups and P&L — the tedious work, automated and audited.',
    chips: ['Billing Engines', 'Cron', 'WhatsApp', 'Twilio', 'Backups'],
    meta: [
      ['Tier', 'Production'],
      ['Runs', '3 engines'],
    ],
  },
  {
    id: 'hardening',
    name: 'Hardening',
    model: 'atif/hardening',
    category: 'Security',
    accent: '#ffab00',
    desc: 'RBAC with editable permission matrices, CSRF protection, login throttling, security headers and an audit trail on every significant change.',
    chips: ['RBAC', 'CSRF', 'Throttling', 'Headers', 'Audit Logs'],
    meta: [
      ['Tier', 'Production'],
      ['Secures', '4 CRMs'],
    ],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    model: 'atif/integrations',
    category: 'Integrations',
    accent: '#b18cff',
    desc: 'Messaging, files, cameras and models wired into daily workflows — Twilio, WhatsApp, CSV import/export, HLS camera streams and AI hooks.',
    chips: ['Twilio', 'WhatsApp API', 'CSV', 'HLS / go2rtc', 'AI Hooks'],
    meta: [
      ['Tier', 'Production'],
      ['Live in', '3 products'],
    ],
  },
  {
    id: 'odoo',
    name: 'Odoo Modules',
    model: 'atif/odoo',
    category: 'Backend',
    accent: '#34dfaa',
    desc: 'Odoo 19 add-ons built to pass an audit: ZATCA Phase 1 QR codes, UBL 2.1 e-invoice XML, recurring memberships, renewals and overlap protection.',
    chips: ['Odoo 19', 'Python', 'ZATCA', 'UBL 2.1', 'QWeb'],
    meta: [
      ['Tier', 'Shipped'],
      ['Modules', '2 public'],
    ],
  },
  {
    id: 'python-ai',
    name: 'Python & AI',
    model: 'atif/python-ai',
    category: 'AI & Data',
    accent: '#4d8dff',
    desc: 'Local-first assistants with persistent memory and a Reality Engine that separates fact from inference instead of confidently guessing.',
    chips: ['Python', 'Memory', 'Local-first', 'LLM Hooks', 'CLI'],
    meta: [
      ['Tier', 'R&D'],
      ['Systems', '2 running'],
    ],
  },
  {
    id: 'domain',
    name: 'Domain Systems',
    model: 'atif/domain',
    category: 'Product',
    accent: '#c8ff00',
    desc: 'The part that matters: CRMs, club management, billing, bookings, HRM and client portals shaped around how a business actually runs — not a template.',
    chips: ['CRM', 'Club Mgmt', 'Billing', 'Bookings', 'Portals'],
    meta: [
      ['Tier', 'Core'],
      ['Codebases', '22 CRM'],
    ],
  },
]

// Projects. `repoName` links a card to live GitHub stats when the repo is public.
export const work = [
  {
    title: 'Asif Snooker Club — Club Management CRM',
    subtitle: 'Live demo · Sample data',
    desc: 'A full club-management system: live table command centre, time-based billing with peak and night bands, bookings and deposits, expenses, P&L, customer portal and WhatsApp reminders. Built for Pakistani snooker clubs — Roman Urdu counter screens, English owner analytics, offline-first, one-time licence. A live demo with sample data is online.',
    tags: ['PHP 8', 'MySQL', 'Billing', 'WhatsApp', 'RBAC'],
    status: ['demo'],
    live: 'https://snooker.site.je',
    featured: true,
  },
  {
    title: 'Odoo Gulf E-Invoicing',
    subtitle: 'Open source · Odoo 19',
    desc: 'ZATCA Phase 1 QR codes and UBL 2.1 e-invoice XML for Saudi Arabia, packaged as an installable Odoo 19 module with tests.',
    tags: ['Python', 'Odoo 19', 'ZATCA', 'UBL 2.1'],
    status: ['open'],
    repo: 'https://github.com/matif157/odoo-gulf-einvoicing',
    repoName: 'odoo-gulf-einvoicing',
  },
  {
    title: 'Syed Professional CRM',
    subtitle: 'Production · Private',
    desc: 'A multi-service professional firm CRM, installer-driven with a Configure screen so a non-developer can move it between servers and re-point MySQL without touching code.',
    tags: ['PHP', 'MySQL', 'Installer', 'Self-hosted'],
    status: ['private'],
    repoName: 'syed-professional-crm',
  },
  {
    title: 'Gravity CRM',
    subtitle: 'Production · Private',
    desc: 'Firm-wide CRM for clients, projects, tasks, invoicing and workflow automation — event-driven, with scoped permissions and AI orchestration hooks.',
    tags: ['PHP', 'Event-driven', 'Automation', 'AI'],
    status: ['private'],
    repoName: 'gravityh',
  },
  {
    title: 'Atif Assistant — Raees',
    subtitle: 'Open source · Local-first',
    desc: 'A personal intelligence system with persistent memory, a Reality Engine that separates fact from inference, Challenge Mode and Pattern Radar.',
    tags: ['Python', 'Memory', 'Local-first', 'AI'],
    status: ['open'],
    repo: 'https://github.com/matif157/atif-assistant',
    repoName: 'atif-assistant',
  },
  {
    title: 'Odoo Club Membership',
    subtitle: 'Open source · Odoo 19',
    desc: 'Recurring club memberships with renewals, overlap protection and automated billing — modelled as a proper Odoo module with test coverage.',
    tags: ['Python', 'Odoo 19', 'Billing', 'Tests'],
    status: ['open'],
    repo: 'https://github.com/matif157/odoo-club-membership',
    repoName: 'odoo-club-membership',
  },
  {
    title: 'Jarvis — Personal Assistant',
    subtitle: 'Open source · Local-first',
    desc: 'A lightweight assistant for capture, recall and small automations — minimal dependencies, easy to self-host, designed to extend with your workflow.',
    tags: ['Python', 'Automation', 'CLI'],
    status: ['open'],
    repo: 'https://github.com/matif157/jarvis',
    repoName: 'jarvis',
  },
  {
    title: 'Portfolio — Code Corpus',
    subtitle: 'Open source · Monorepo',
    desc: 'Every CRM, website and tool I have shipped, organised as a monorepo — one branch per category with the full source of 22 CRM codebases.',
    tags: ['Monorepo', 'Git', 'CRM'],
    status: ['open'],
    repo: 'https://github.com/matif157/portfolio',
    repoName: 'portfolio',
  },
]

export const contact = {
  title: ['Your business has outgrown', 'the spreadsheet.'],
  sub: 'Tell me the process that eats your week. I will tell you honestly whether software fixes it, what it costs and how long it takes.',
  facts: [
    ['Based in', 'Faisalabad, PK'],
    ['Response time', 'Within 24 hours'],
    ['Working hours', 'PKT · UTC+5'],
    ['Engagement', 'Remote worldwide'],
  ],
}
