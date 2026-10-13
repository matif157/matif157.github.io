// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Muhammad Atif',
  role: 'CRM & Business Software Developer',
  location: 'Faisalabad, PK',
  email: 'matifzahoor1577@gmail.com',
  since: '2024',
  repoCount: 8,
  // CV files live in public/. The Download CV button offers each format below.
  resume: {
    pdf: '/Muhammad-Atif-CRM-Software-Developer-Resume-v4.pdf',
    docx: '/Muhammad-Atif-Branded-Resume.docx',
  },
}

export const lede =
  'I design and ship <b>production CRM &amp; business software</b> — PHP 8 back-ends, MySQL data and real-time dashboards that replace paper registers, spreadsheets and memory. Every system I build runs a real business, every day.'

export const about = [
  "I'm a CRM and business software developer who cares as much about how a system holds up at the end of a long shift — when the owners are offline and staff are on their own — as how it feels to click. My work sits at the seam between solid PHP/MySQL architecture and interfaces a non-technical team can actually run, and I'm happiest when both are pulling in the same direction.",
  "Over the past years I've designed and shipped <b>club-management systems, professional-services CRMs, billing and payments engines, booking systems and reporting dashboards</b> — production software in daily use with real staff, real money and real problems. I built a billing engine with peak and night rate bands, WhatsApp reminders that fetch the unpaid money, P&amp;L the owner checks from a phone, and audit logs on every significant change.",
  "I'm a believer in <b>open source and always shipping.</b> Every production system I build is published on GitHub so clients and developers can inspect, extend and own it — no vendor lock-in, no black boxes. From tightening a query to training staff with picture-based Urdu guides, I treat every project as a chance to leave the business better than I found it.",
]

export const facts = [
  { k: 'Based in', v: 'Faisalabad, Pakistan', sub: 'Working with businesses worldwide' },
  { k: 'Focus', v: 'CRM & Business Software', sub: 'PHP 8 · MySQL · Automation' },
  { k: 'Currently', v: 'Open to projects', sub: 'CRM builds · Custom systems · Freelance' },
]

export const expertise = [
  {
    tag: 'backend',
    title: 'PHP & Data',
    desc: 'Robust PHP 8 back-ends on MySQL with prepared statements, indexes tuned for reporting and clean service layers that scale with the business.',
    chips: ['PHP 8', 'MySQL', 'REST APIs', 'Cron / CLI', 'Laravel'],
  },
  {
    tag: 'frontend',
    title: 'Interface Engineering',
    desc: 'Fast, responsive dashboards staff can operate all shift — live tables, billing screens and reporting without the learning curve.',
    chips: ['JavaScript', 'Alpine.js', 'Chart.js', 'Tailwind', 'CSS'],
  },
  {
    tag: 'automation',
    title: 'Workflow Automation',
    desc: 'Rate and billing engines, scheduled reminders, WhatsApp follow-ups, backups and P&L — the boring work, automated and audited.',
    chips: ['Billing Engines', 'Scheduled Jobs', 'WhatsApp', 'Backups', 'Audit Logs'],
  },
  {
    tag: 'security',
    title: 'Production Hardening',
    desc: 'RBAC with editable permission matrices, CSRF protection, login throttling, security headers and audit logging on every significant change.',
    chips: ['RBAC', 'CSRF', 'Throttling', 'Security Headers', 'Docker'],
  },
  {
    tag: 'integrations',
    title: 'Integrations & AI',
    desc: 'Twilio and WhatsApp messaging, CSV import/export, HLS camera streams and AI orchestration hooks wired into real daily workflows.',
    chips: ['Twilio', 'WhatsApp', 'CSV Import/Export', 'HLS / go2rtc', 'AI Hooks'],
  },
  {
    tag: 'domains',
    title: 'What I Build',
    desc: 'End-to-end business systems: CRMs, club and service-firm software, booking, billing, customer portals and reporting.',
    chips: ['CRM', 'Club Mgmt', 'Booking', 'Billing', 'HRM', 'Portals'],
  },
]

// Concrete product types shipped — rendered as a tag grid under Expertise.
export const builds = [
  'Custom CRM Development',
  'Club Management Systems',
  'Billing & Payments Engines',
  'Booking Systems',
  'Professional Services CRMs',
  'HRM Systems',
  'Sales Tracking',
  'Inventory Management',
  'Customer Portals',
  'Reporting Dashboards',
  'Profit & Loss Reports',
  'WhatsApp Automation',
  'Appointment Scheduling',
  'Membership Tracking',
  'Document Management',
  'Multi-tenant Systems',
  'Workflow Automation',
  'AI-Ready Integrations',
  'Data Import / Export',
  'Staff Training Docs',
]

// Each project: tags drive the chips; `repo`/`live` render as separate links;
// `featured: true` promotes a project to a full-width highlighted card.
export const work = [
  {
    title: 'Asif Snooker Club — Club Management CRM',
    desc: 'A full production club-management system in daily use: live table command center, time-based billing with peak & night rates, bookings & deposits, payments, expenses, P&L, customer portal and WhatsApp reminders. Deployed at a live club in Pakistan.',
    tags: ['PHP 8', 'MySQL', 'Billing', 'WhatsApp', 'RBAC'],
    repo: 'https://github.com/matif157/asif-snooker-club',
    live: 'https://asif-snooker-club.site.je',
    featured: true,
  },
  {
    title: 'Syed Professional CRM Platform',
    desc: 'A production CRM platform for a multi-service professional firm — installer-driven with a Configure screen so a non-developer can move it between servers and re-point the MySQL database without touching code.',
    tags: ['PHP', 'MySQL', 'Self-hosted', 'Installer'],
    repo: 'https://github.com/matif157/syed-professional-crm',
    live: '',
  },
  {
    title: 'Gravity CRM — Professional Services',
    desc: 'Firm-wide CRM handling clients, projects, tasks, invoicing and workflow automation — event-driven architecture with AI orchestration hooks, scoped permissions and continuous production use.',
    tags: ['PHP', 'Event-driven', 'Automation', 'AI'],
    repo: 'https://github.com/matif157/gravityh',
    live: '',
  },
  {
    title: 'Atif Assistant — Personal Intelligence',
    desc: 'A local-first personal intelligence system with persistent memory, a Reality Engine that separates fact from inference, Challenge Mode and Pattern Radar — built for honest decision support.',
    tags: ['Python', 'Local-first', 'Memory', 'AI'],
    repo: 'https://github.com/matif157/atif-assistant',
    live: '',
  },
  {
    title: 'Jarvis — Personal Assistant',
    desc: 'A lightweight, local-first assistant for capture, recall and small automations — privacy-minded, minimal dependencies, easy to self-host and extend as your workflow evolves.',
    tags: ['Open source', 'Local-first', 'Automation'],
    repo: 'https://github.com/matif157/jarvis',
    live: '',
  },
  {
    title: 'Portfolio — Code Corpus',
    desc: 'Every CRM, website and tool I have shipped, organized as a monorepo — one branch per category (softwares / websites / tools) with the full source of 22 CRM codebases.',
    tags: ['Monorepo', 'Git', 'CRM'],
    repo: 'https://github.com/matif157/portfolio',
    live: '',
  },
]

export const socials = [
  { label: 'GitHub', url: 'https://github.com/matif157' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-atif-932824287' },
  { label: 'X / Twitter', url: 'https://x.com/MatifZahoo93222' },
  { label: 'Upwork', url: 'https://www.upwork.com/freelancers/~011c6c1167bf525459' },
  { label: 'WhatsApp', url: 'https://wa.me/923467560172' },
]