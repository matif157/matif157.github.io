/**
 * MA — Intelligence Constellation
 * Single source of truth for the graph. Visual components never hardcode nodes.
 *
 * Status rule: real work is PRODUCTION / DEPLOYED. Experiments are PROTOTYPE or
 * IN PROGRESS. Things being learned are LEARNING / EXPLORING. Nothing here is
 * claimed as integrated unless it exists in the portfolio.
 */

export const CATEGORIES = {
  identity: { label: 'Identity', color: '#C6FF6E', filter: 'identity' },
  provider: { label: 'AI Providers', color: '#B39BFF', filter: 'ai' },
  model: { label: 'AI Models', color: '#8178FF', filter: 'ai' },
  project: { label: 'Projects', color: '#59E0B2', filter: 'projects' },
  language: { label: 'Languages', color: '#54DFFF', filter: 'languages' },
  framework: { label: 'Frameworks', color: '#558BFF', filter: 'frameworks' },
  database: { label: 'Databases & Data', color: '#7B8CFF', filter: 'databases' },
  infrastructure: { label: 'Cloud & Infrastructure', color: '#4BC6FF', filter: 'infrastructure' },
  security: { label: 'Security & Engineering', color: '#8FE3B8', filter: 'security' },
  tool: { label: 'Tools & Capabilities', color: '#CDB8FF', filter: 'tools' },
}

export const STATUSES = {
  production: { label: 'Production', color: '#59E0B2' },
  deployed: { label: 'Deployed', color: '#59E0B2' },
  prototype: { label: 'Prototype', color: '#8178FF' },
  'in-progress': { label: 'In progress', color: '#558BFF' },
  learning: { label: 'Learning', color: '#8A93B5' },
  exploring: { label: 'Exploring', color: '#8A93B5' },
  planned: { label: 'Planned', color: '#5A6480' },
}

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI Models' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'databases', label: 'Databases' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'security', label: 'Security' },
  { id: 'tools', label: 'Tools' },
]

const n = (id, name, type, status, description, extra = {}) => ({
  id, name, type, status, description, links: {}, meta: [], keywords: [], ...extra,
})

const e = (source, target, relationship, description = '') => ({
  source, target, relationship, description,
})

const nodes = [
  // ---------------------------------------------------------------- identity
  n('ma', 'MA', 'identity', 'production',
    'Muhammad Atif — CRM & Business Software Developer. This graph is the ecosystem: the models, projects and engineering systems that connect to one another.',
    { meta: [['Based in', 'Faisalabad, PK'], ['Focus', 'CRM & business software']],
      links: { github: 'https://github.com/matif157', docs: 'https://matif157.github.io/' },
      keywords: ['muhammad atif', 'atif systems', 'developer'] }),

  // ------------------------------------------------------------ AI providers
  n('openai', 'OpenAI', 'provider', 'exploring',
    'Provider being researched for model capabilities. No OpenAI integration is claimed in a shipped project.',
    { keywords: ['gpt', 'openai'] }),
  n('google', 'Google', 'provider', 'exploring',
    'Provider being researched for multimodal model capabilities. No Google model integration is claimed in a shipped project.',
    { keywords: ['gemini', 'google'] }),
  n('anthropic', 'Anthropic', 'provider', 'exploring',
    'Provider being researched for coding and reasoning workflows. No Anthropic integration is claimed in a shipped project.',
    { keywords: ['claude', 'anthropic'] }),
  n('deepseek', 'DeepSeek', 'provider', 'exploring',
    'Provider being researched for reasoning models. No DeepSeek integration is claimed in a shipped project.',
    { keywords: ['deepseek'] }),
  n('meta', 'Meta', 'provider', 'exploring',
    'Provider of open-weight Llama models being researched for local-first experiments. No Meta integration is claimed in a shipped project.',
    { keywords: ['llama', 'meta'] }),
  n('mistral', 'Mistral', 'provider', 'exploring',
    'Provider being researched for efficient open models. No Mistral integration is claimed in a shipped project.',
    { keywords: ['mistral'] }),

  // -------------------------------------------------------------- AI models
  n('gpt-family', 'GPT models', 'model', 'exploring',
    'OpenAI GPT model family. Capability research only — not wired into a production project.',
    { parent: 'openai' }),
  n('o-series', 'o-series models', 'model', 'exploring',
    'OpenAI reasoning model family. Capability research only — not wired into a production project.',
    { parent: 'openai' }),
  n('gemini-family', 'Gemini models', 'model', 'exploring',
    'Google Gemini model family. Capability research only — not wired into a production project.',
    { parent: 'google' }),
  n('claude-family', 'Claude models', 'model', 'exploring',
    'Anthropic Claude model family. Capability research only — not wired into a production project.',
    { parent: 'anthropic' }),
  n('deepseek-family', 'DeepSeek models', 'model', 'exploring',
    'DeepSeek model family. Capability research only — not wired into a production project.',
    { parent: 'deepseek' }),
  n('llama-family', 'Llama models', 'model', 'exploring',
    'Meta Llama open-weight family. Relevant to local-first research, not a shipped integration.',
    { parent: 'meta' }),
  n('mistral-family', 'Mistral models', 'model', 'exploring',
    'Mistral model family. Capability research only — not wired into a production project.',
    { parent: 'mistral' }),

  // ---------------------------------------------------------------- projects
  n('gravity-crm', 'GRAVITY CRM', 'project', 'production',
    'Private production CRM for clients, projects, tasks, invoicing and workflow automation. Event-driven, scoped permissions and AI orchestration hooks.',
    { meta: [['Availability', 'Private build'], ['Stage', 'Production']], keywords: ['crm', 'automation'] }),
  n('ai-document-intelligence', 'AI Document Intelligence', 'project', 'planned',
    'Proposed research direction: document parsing, retrieval and model-assisted understanding. Concept only — not built.',
    { meta: [['Stage', 'Concept']], keywords: ['rag', 'documents', 'ocr'] }),
  n('ma-ai-gateway', 'MA AI Gateway', 'project', 'planned',
    'Proposed multi-provider gateway design for routing and comparing model calls. Concept only — not built.',
    { meta: [['Stage', 'Concept']], keywords: ['gateway', 'routing', 'api'] }),
  n('secure-cloud-platform', 'Secure Cloud Platform', 'project', 'planned',
    'Proposed cloud foundation with identity, isolation and automated delivery. Concept only — not built.',
    { meta: [['Stage', 'Concept']], keywords: ['cloud', 'security', 'platform'] }),
  n('business-automation-platform', 'Business Automation Platform', 'project', 'production',
    'The automation layer inside the CRMs: rate engines, scheduled follow-ups, WhatsApp reminders, backups and P&L reporting.',
    { meta: [['Stage', 'Production'], ['Used in', 'Multiple CRMs']], keywords: ['automation', 'billing', 'whatsapp'] }),
  n('personal-portfolio-ecosystem', 'Personal Portfolio Ecosystem', 'project', 'deployed',
    'This site and its build pipeline: a React portfolio plus the Intelligence Constellation, deployed from one repository.',
    { links: { github: 'https://github.com/matif157/matif157.github.io', docs: 'https://matif157.github.io/' },
      meta: [['Stage', 'Deployed']], keywords: ['portfolio', 'website', 'react'] }),

  // Real open-source work — added so the graph reflects actual shipped code.
  n('snooker-crm', 'Asif Snooker Club CRM', 'project', 'deployed',
    'Club management with live tables, time-based billing, bookings, expenses, P&L, a customer portal and WhatsApp reminders. Live demo uses sample data.',
    { links: { demo: 'https://snooker.site.je' }, meta: [['Demo', 'Sample data']], keywords: ['snooker', 'club', 'billing'] }),
  n('odoo-gulf-einvoicing', 'Odoo Gulf E-Invoicing', 'project', 'production',
    'Installable Odoo 19 module: ZATCA Phase 1 QR codes and UBL 2.1 e-invoice XML for Saudi Arabia, with tests.',
    { links: { github: 'https://github.com/matif157/odoo-gulf-einvoicing' }, meta: [['Stage', 'Open source']], keywords: ['odoo', 'zatca', 'invoicing'] }),
  n('odoo-club-membership', 'Odoo Club Membership', 'project', 'production',
    'Recurring memberships with renewals, overlap protection and automated billing as a tested Odoo 19 module.',
    { links: { github: 'https://github.com/matif157/odoo-club-membership' }, meta: [['Stage', 'Open source']], keywords: ['odoo', 'membership'] }),
  n('atif-assistant', 'Atif Assistant — Raees', 'project', 'prototype',
    'Local-first personal intelligence system with persistent memory, a Reality Engine, Challenge Mode and Pattern Radar.',
    { links: { github: 'https://github.com/matif157/atif-assistant' }, meta: [['Stage', 'Open source']], keywords: ['assistant', 'memory', 'local-first'] }),
  n('jarvis', 'Jarvis', 'project', 'prototype',
    'Lightweight local-first assistant for capture, recall and small automations. Minimal dependencies, self-hostable.',
    { links: { github: 'https://github.com/matif157/jarvis' }, meta: [['Stage', 'Open source']], keywords: ['assistant', 'cli', 'automation'] }),
  n('portfolio-corpus', 'Portfolio Code Corpus', 'project', 'deployed',
    'Monorepo of shipped CRMs, websites and tools — one branch per category, including 22 CRM codebases.',
    { links: { github: 'https://github.com/matif157/portfolio' }, meta: [['Stage', 'Open source']], keywords: ['monorepo', 'crm', 'git'] }),

  // --------------------------------------------------------------- languages
  n('python', 'Python', 'language', 'production',
    'Odoo modules, local-first assistants, scripting and data work. Used in shipped code.',
    { keywords: ['py', 'backend'] }),
  n('php', 'PHP', 'language', 'production',
    'Primary backend language for CRMs and billing systems — PHP 8 with prepared queries and service layers.',
    { keywords: ['php8', 'backend', 'pdo'] }),
  n('javascript', 'JavaScript', 'language', 'production',
    'Interfaces, live tables and dashboards in production systems and this portfolio.',
    { keywords: ['js', 'frontend'] }),
  n('sql', 'SQL', 'language', 'production',
    'Schema design, indexed reporting queries and data integrity in MySQL-backed systems.',
    { keywords: ['query', 'database'] }),
  n('html', 'HTML', 'language', 'production', 'Semantic markup for dashboards, portals and public sites.'),
  n('css', 'CSS', 'language', 'production', 'Responsive layouts and the design systems behind the interfaces.'),
  n('typescript', 'TypeScript', 'language', 'learning',
    'Being learned for typed frontend architecture. Not currently used in the shipped portfolio build.',
    { keywords: ['ts', 'types'] }),
  n('cpp', 'C / C++', 'language', 'exploring',
    'Explored for low-level performance work. Not used in current projects.',
    { keywords: ['c++', 'systems'] }),

  // -------------------------------------------------------------- frameworks
  n('react', 'React', 'framework', 'production',
    'Component architecture for this portfolio and its interactive constellation.',
    { keywords: ['ui', 'frontend'] }),
  n('nextjs', 'Next.js', 'framework', 'exploring',
    'Being evaluated for future server-rendered product surfaces. Not in the current build.',
    { keywords: ['ssr', 'react'] }),
  n('fastapi', 'FastAPI', 'framework', 'exploring',
    'Being explored for typed Python APIs in proposed AI services.',
    { keywords: ['python', 'api'] }),
  n('nodejs', 'Node.js', 'framework', 'exploring',
    'Being explored for tooling and lightweight services. Not in current production work.',
    { keywords: ['javascript', 'runtime'] }),
  n('laravel', 'Laravel', 'framework', 'learning',
    'Framework patterns studied alongside PHP 8 service-layer work; not a claimed production framework.',
    { keywords: ['php', 'mvc'] }),
  n('langchain', 'LangChain', 'framework', 'exploring',
    'Being researched for agent orchestration. No production system uses it.',
    { keywords: ['agents', 'llm'] }),
  n('llamaindex', 'LlamaIndex', 'framework', 'exploring',
    'Being researched for retrieval-augmented patterns. No production system uses it.',
    { keywords: ['rag', 'index'] }),

  // ------------------------------------------------------- databases and data
  n('mysql', 'MySQL', 'database', 'production',
    'Primary database for CRMs: indexed schemas, prepared queries, reporting and backups.',
    { keywords: ['sql', 'rdbms'] }),
  n('postgresql', 'PostgreSQL', 'database', 'learning',
    'Being learned for relational design beyond current MySQL systems.',
    { keywords: ['sql', 'rdbms'] }),
  n('redis', 'Redis', 'database', 'exploring',
    'Being explored for caching and ephemeral state. Not deployed in a shipped project.',
    { keywords: ['cache', 'key-value'] }),
  n('mongodb', 'MongoDB', 'database', 'exploring',
    'Being explored for document storage. Not deployed in a shipped project.',
    { keywords: ['document', 'nosql'] }),
  n('pgvector', 'pgvector', 'database', 'exploring',
    'Vector extension being researched for semantic search. No deployed usage.',
    { keywords: ['vector', 'embeddings', 'postgres'] }),
  n('qdrant', 'Qdrant', 'database', 'exploring',
    'Vector database being researched for retrieval experiments. No deployed usage.',
    { keywords: ['vector', 'search'] }),
  n('vector-databases', 'Vector databases', 'database', 'exploring',
    'The retrieval storage category behind proposed RAG work. Research only.',
    { keywords: ['embeddings', 'rag'] }),
  n('data-pipelines', 'Data pipelines', 'database', 'in-progress',
    'Import, export and reporting flows in production CRMs, evolving into more structured pipelines.',
    { keywords: ['etl', 'csv', 'import'] }),
  n('data-processing', 'Data processing', 'database', 'production',
    'Aggregation and P&L reporting over operational data in the billing and club systems.',
    { keywords: ['reporting', 'analytics'] }),

  // ----------------------------------------------------- cloud & infrastructure
  n('aws', 'Amazon AWS', 'infrastructure', 'exploring',
    'Being studied for deployment and managed services. No claimed production deployment.',
    { keywords: ['amazon', 'cloud'] }),
  n('azure', 'Microsoft Azure', 'infrastructure', 'exploring',
    'Being studied for enterprise cloud patterns. No claimed production deployment.',
    { keywords: ['microsoft', 'cloud'] }),
  n('gcp', 'Google Cloud', 'infrastructure', 'exploring',
    'Being studied for cloud and data services. No claimed production deployment.',
    { keywords: ['google cloud', 'cloud'] }),
  n('linux', 'Linux', 'infrastructure', 'production',
    'Server and development environment for self-hosted systems.',
    { keywords: ['unix', 'server'] }),
  n('docker', 'Docker', 'infrastructure', 'production',
    'Repeatable local and deployment environments for systems and experiments.',
    { keywords: ['containers', 'container'] }),
  n('kubernetes', 'Kubernetes', 'infrastructure', 'learning',
    'Being learned for orchestration. Not used in deployed projects.',
    { keywords: ['k8s', 'orchestration'] }),
  n('terraform', 'Terraform', 'infrastructure', 'exploring',
    'Being explored for declarative infrastructure. No deployed usage.',
    { keywords: ['iac', 'infrastructure'] }),
  n('cicd', 'CI / CD', 'infrastructure', 'in-progress',
    'Build and deployment automation currently used for this repository, expanding across projects.',
    { keywords: ['pipeline', 'github actions', 'deploy'] }),
  n('serverless', 'Serverless architecture', 'infrastructure', 'exploring',
    'Being explored for event-driven workloads. Not a claimed deployment model.',
    { keywords: ['functions', 'faas'] }),
  n('distributed-systems', 'Distributed systems', 'infrastructure', 'learning',
    'Concepts being studied: consistency, queues and failure isolation.',
    { keywords: ['architecture', 'scaling'] }),
  n('monitoring', 'Infrastructure monitoring', 'infrastructure', 'in-progress',
    'Health and error visibility being added around deployed services.',
    { keywords: ['observability', 'alerts'] }),
  n('logging', 'Logging', 'infrastructure', 'production',
    'Audit trails and operational logs in the CRM and billing systems.',
    { keywords: ['audit', 'observability'] }),

  // ------------------------------------------------------ security & engineering
  n('iam', 'IAM', 'security', 'learning',
    'Identity and access management principles being studied for proposed cloud work.',
    { keywords: ['identity', 'access'] }),
  n('oauth', 'OAuth', 'security', 'learning',
    'Delegated authorization being studied. Not a claimed integration in shipped projects.',
    { keywords: ['authorization', 'login'] }),
  n('rbac', 'RBAC', 'security', 'production',
    'Editable permission matrices and scoped access in production CRMs.',
    { keywords: ['permissions', 'roles', 'access'] }),
  n('zero-trust', 'Zero Trust', 'security', 'exploring',
    'Security model being researched for the proposed cloud platform.',
    { keywords: ['security', 'architecture'] }),
  n('cloud-security', 'Cloud Security', 'security', 'exploring',
    'Cloud hardening concepts being studied. No certified production deployment claimed.',
    { keywords: ['cloud', 'hardening'] }),
  n('devsecops', 'DevSecOps', 'security', 'learning',
    'Bringing security checks into delivery pipelines. Being learned.',
    { keywords: ['pipeline', 'security'] }),
  n('app-security', 'Application Security', 'security', 'in-progress',
    'CSRF protection, login throttling, security headers and input validation in production systems.',
    { keywords: ['csrf', 'headers', 'validation'] }),
  n('api-security', 'API Security', 'security', 'in-progress',
    'Guarding interfaces with validation, scoped permissions and audit events.',
    { keywords: ['api', 'validation'] }),
  n('ai-security', 'AI System Security', 'security', 'exploring',
    'Research area: prompt injection, data boundaries and fact-versus-inference separation. Not a shipped product.',
    { keywords: ['prompt injection', 'llm'] }),
  n('automated-testing', 'Automated Testing', 'security', 'in-progress',
    'Tests in shipped Odoo modules and build checks for the portfolio.',
    { keywords: ['tests', 'quality'] }),

  // --------------------------------------------------------- tools & capabilities
  n('git', 'Git', 'tool', 'production', 'Version control across every codebase and the monorepo.', { keywords: ['vcs', 'github'] }),
  n('github', 'GitHub', 'tool', 'production', 'Source, issues, releases and the live repository snapshot.',
    { links: { github: 'https://github.com/matif157' }, keywords: ['source', 'repo'] }),
  n('linkedin', 'LinkedIn', 'tool', 'deployed', 'Professional activity and published notes.',
    { links: { docs: 'https://www.linkedin.com/in/muhammad-atif-932824287' }, keywords: ['profile', 'activity'] }),
  n('odoo19', 'Odoo 19', 'tool', 'production', 'ERP/CRM platform for the Gulf invoicing and club membership modules.',
    { keywords: ['erp', 'modules'] }),
  n('whatsapp-api', 'WhatsApp API', 'tool', 'production', 'Reminders and payment follow-ups in club and CRM workflows.',
    { keywords: ['messaging', 'reminders'] }),
  n('twilio', 'Twilio', 'tool', 'production', 'Messaging integration used in production workflows.',
    { keywords: ['sms', 'messaging'] }),
  n('rest-api', 'REST APIs', 'tool', 'production', 'Service boundaries between systems, portals and integrations.',
    { keywords: ['http', 'integration'] }),
  n('rag', 'RAG', 'tool', 'exploring', 'Retrieval-augmented generation pattern used in proposed AI work, not in production.',
    { keywords: ['retrieval', 'llm', 'vector'] }),
  n('persistent-memory', 'Persistent Memory', 'tool', 'prototype', 'Memory layer in Atif Assistant that keeps context across sessions.',
    { keywords: ['memory', 'assistant'] }),
  n('llm-hooks', 'LLM Hooks', 'tool', 'in-progress', 'Model call points being wired into CRM workflows; not provider-specific.',
    { keywords: ['ai', 'integration'] }),
  n('event-driven', 'Event-driven design', 'tool', 'production', 'Domain events coordinating work in Gravity CRM.',
    { keywords: ['events', 'architecture'] }),
  n('billing-engine', 'Billing engines', 'tool', 'production', 'Peak/night rate bands, invoices and collection tracking in live systems.',
    { keywords: ['rates', 'invoicing'] }),
  n('cron', 'Scheduling / Cron', 'tool', 'production', 'Timed jobs for reminders, backups and recurring billing.',
    { keywords: ['jobs', 'scheduler'] }),
  n('local-first', 'Local-first', 'tool', 'prototype', 'Design approach in the assistant projects: data stays close to the user.',
    { keywords: ['offline', 'privacy'] }),
  n('vector-search', 'Vector search', 'tool', 'exploring', 'Semantic retrieval research for proposed document intelligence.',
    { keywords: ['embeddings', 'search'] }),
]

const edges = [
  // Identity → ecosystems (only the primary branches connect to MA directly)
  e('ma', 'openai', 'explores'), e('ma', 'google', 'explores'),
  e('ma', 'anthropic', 'explores'), e('ma', 'deepseek', 'explores'),
  e('ma', 'meta', 'explores'), e('ma', 'mistral', 'explores'),
  e('ma', 'gravity-crm', 'develops'), e('ma', 'business-automation-platform', 'develops'),
  e('ma', 'personal-portfolio-ecosystem', 'builds'),
  e('ma', 'ai-document-intelligence', 'proposes'), e('ma', 'ma-ai-gateway', 'proposes'),
  e('ma', 'secure-cloud-platform', 'proposes'),
  e('ma', 'snooker-crm', 'ships'), e('ma', 'odoo-gulf-einvoicing', 'ships'),
  e('ma', 'odoo-club-membership', 'ships'), e('ma', 'atif-assistant', 'prototypes'),
  e('ma', 'jarvis', 'prototypes'), e('ma', 'portfolio-corpus', 'maintains'),
  e('ma', 'python', 'works-with'), e('ma', 'php', 'works-with'),
  e('ma', 'javascript', 'works-with'), e('ma', 'git', 'works-with'),

  // Providers → model families
  e('openai', 'gpt-family', 'provides'), e('openai', 'o-series', 'provides'),
  e('google', 'gemini-family', 'provides'),
  e('anthropic', 'claude-family', 'provides'),
  e('deepseek', 'deepseek-family', 'provides'),
  e('meta', 'llama-family', 'provides'),
  e('mistral', 'mistral-family', 'provides'),

  // Language → framework / database relationships
  e('python', 'fastapi', 'used-by'), e('python', 'langchain', 'used-by'),
  e('python', 'llamaindex', 'used-by'), e('python', 'odoo19', 'powers'),
  e('javascript', 'react', 'used-by'), e('javascript', 'nodejs', 'used-by'),
  e('typescript', 'nextjs', 'explores-with'),
  e('sql', 'mysql', 'queries'), e('sql', 'postgresql', 'queries'),
  e('postgresql', 'pgvector', 'extended-by'),
  e('qdrant', 'vector-databases', 'instance-of'),
  e('pgvector', 'vector-databases', 'instance-of'),
  e('data-pipelines', 'data-processing', 'feeds'),

  // Framework / database → infrastructure
  e('docker', 'linux', 'runs-on'), e('kubernetes', 'docker', 'orchestrates'),
  e('terraform', 'aws', 'provisions'), e('terraform', 'azure', 'provisions'),
  e('terraform', 'gcp', 'provisions'), e('serverless', 'aws', 'potential-on'),
  e('cicd', 'git', 'triggered-by'), e('cicd', 'automated-testing', 'runs'),
  e('monitoring', 'logging', 'reads'), e('monitoring', 'docker', 'watches'),
  e('distributed-systems', 'serverless', 'relates-to'),

  // Security relationships
  e('iam', 'oauth', 'implements'), e('iam', 'rbac', 'implements'),
  e('zero-trust', 'iam', 'depends-on'), e('zero-trust', 'cloud-security', 'part-of'),
  e('devsecops', 'cicd', 'extends'), e('devsecops', 'app-security', 'includes'),
  e('app-security', 'api-security', 'overlaps'),
  e('app-security', 'automated-testing', 'verified-by'),
  e('api-security', 'rest-api', 'protects'),
  e('ai-security', 'llm-hooks', 'applies-to'),
  e('ai-security', 'persistent-memory', 'applies-to'),

  // Real project → actual stack
  e('gravity-crm', 'php', 'built-with'), e('gravity-crm', 'rbac', 'built-with'),
  e('gravity-crm', 'event-driven', 'built-with'), e('gravity-crm', 'llm-hooks', 'has-hooks'),
  e('gravity-crm', 'logging', 'built-with'),
  e('business-automation-platform', 'php', 'built-with'),
  e('business-automation-platform', 'billing-engine', 'built-with'),
  e('business-automation-platform', 'whatsapp-api', 'built-with'),
  e('business-automation-platform', 'twilio', 'built-with'),
  e('business-automation-platform', 'cron', 'built-with'),
  e('snooker-crm', 'php', 'built-with'), e('snooker-crm', 'mysql', 'built-with'),
  e('snooker-crm', 'billing-engine', 'built-with'),
  e('snooker-crm', 'whatsapp-api', 'built-with'), e('snooker-crm', 'rbac', 'built-with'),
  e('snooker-crm', 'data-processing', 'built-with'),
  e('odoo-gulf-einvoicing', 'python', 'built-with'),
  e('odoo-gulf-einvoicing', 'odoo19', 'built-with'),
  e('odoo-gulf-einvoicing', 'automated-testing', 'built-with'),
  e('odoo-club-membership', 'python', 'built-with'),
  e('odoo-club-membership', 'odoo19', 'built-with'),
  e('odoo-club-membership', 'billing-engine', 'built-with'),
  e('atif-assistant', 'python', 'built-with'),
  e('atif-assistant', 'persistent-memory', 'built-with'),
  e('atif-assistant', 'local-first', 'designed-with'),
  e('jarvis', 'python', 'built-with'), e('jarvis', 'local-first', 'designed-with'),
  e('portfolio-corpus', 'git', 'organized-with'),
  e('personal-portfolio-ecosystem', 'react', 'built-with'),
  e('personal-portfolio-ecosystem', 'javascript', 'built-with'),
  e('personal-portfolio-ecosystem', 'css', 'built-with'),
  e('personal-portfolio-ecosystem', 'cicd', 'deployed-with'),
  e('personal-portfolio-ecosystem', 'git', 'built-with'),

  // Proposed projects → deliberately labelled 'would-use' relationships
  e('ai-document-intelligence', 'gpt-family', 'would-use'),
  e('ai-document-intelligence', 'gemini-family', 'would-use'),
  e('ai-document-intelligence', 'python', 'would-use'),
  e('ai-document-intelligence', 'fastapi', 'would-use'),
  e('ai-document-intelligence', 'rag', 'would-use'),
  e('ai-document-intelligence', 'vector-search', 'would-use'),
  e('ai-document-intelligence', 'qdrant', 'would-use'),
  e('ma-ai-gateway', 'gpt-family', 'would-use'),
  e('ma-ai-gateway', 'claude-family', 'would-use'),
  e('ma-ai-gateway', 'gemini-family', 'would-use'),
  e('ma-ai-gateway', 'deepseek-family', 'would-use'),
  e('ma-ai-gateway', 'llama-family', 'would-use'),
  e('ma-ai-gateway', 'mistral-family', 'would-use'),
  e('ma-ai-gateway', 'python', 'would-use'), e('ma-ai-gateway', 'rest-api', 'would-use'),
  e('ma-ai-gateway', 'api-security', 'would-use'),
  e('secure-cloud-platform', 'aws', 'would-use'),
  e('secure-cloud-platform', 'azure', 'would-use'),
  e('secure-cloud-platform', 'gcp', 'would-use'),
  e('secure-cloud-platform', 'terraform', 'would-use'),
  e('secure-cloud-platform', 'kubernetes', 'would-use'),
  e('secure-cloud-platform', 'zero-trust', 'would-use'),
  e('secure-cloud-platform', 'iam', 'would-use'),
  e('secure-cloud-platform', 'devsecops', 'would-use'),
]

export function validateEcosystem(data) {
  const ids = new Set()
  const errors = []
  for (const node of data.nodes) {
    if (!node.id || !node.name || !node.type) errors.push('Node missing id/name/type')
    if (ids.has(node.id)) errors.push(`Duplicate node id: ${node.id}`)
    if (!CATEGORIES[node.type]) errors.push(`Unknown category on ${node.id}: ${node.type}`)
    if (!STATUSES[node.status]) errors.push(`Unknown status on ${node.id}: ${node.status}`)
    ids.add(node.id)
  }
  for (const node of data.nodes) {
    if (node.parent && !ids.has(node.parent)) errors.push(`Invalid parent on ${node.id}: ${node.parent}`)
  }
  const pairs = new Set()
  for (const edge of data.edges) {
    if (!ids.has(edge.source)) errors.push(`Invalid edge source: ${edge.source}`)
    if (!ids.has(edge.target)) errors.push(`Invalid edge target: ${edge.target}`)
    if (edge.source === edge.target) errors.push(`Self-loop on ${edge.source}`)
    const key = `${edge.source}->${edge.target}`
    if (pairs.has(key)) errors.push(`Duplicate edge: ${key}`)
    pairs.add(key)
  }
  if (errors.length) throw new Error(`Invalid constellation data:\n- ${errors.join('\n- ')}`)
  return data
}

export const ecosystem = validateEcosystem({ nodes, edges })
export default ecosystem
