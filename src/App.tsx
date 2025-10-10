import { useEffect, useMemo, useState } from 'react'

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Send,
} from 'lucide-react'

type Project = {
  title: string
  description: string
  impact: string
  tags: string[]
  link: string
}

const projects: Project[] = [
  {
    title: 'Realtime Collaboration Suite',
    description:
      'A collaborative whiteboard and document editing platform with live cursors, presence, and conflict resolution powered by CRDTs.',
    impact:
      'Reduced document sync conflicts by 93% for a design organization with 2k+ daily active users.',
    tags: ['Typescript', 'React', 'WebRTC', 'CRDT'],
    link: 'https://example.com/project/realtime-suite',
  },
  {
    title: 'Developer Insights Dashboard',
    description:
      'A metrics dashboard that consolidates Git activity, deployments, and incident response into actionable insights for engineering leaders.',
    impact:
      'Accelerated release cadence by 28% by surfacing bottlenecks and DORA metrics in real time.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind'],
    link: 'https://example.com/project/dev-insights',
  },
  {
    title: 'Edge AI Content Moderator',
    description:
      'Lightweight on-device ML pipeline for filtering user-generated media in under 40ms with adaptive model updates.',
    impact:
      'Enabled compliance at scale for a social platform processing 10M+ uploads per day.',
    tags: ['Python', 'ONNX', 'Rust', 'gRPC'],
    link: 'https://example.com/project/edge-ai',
  },
  {
    title: 'Sustainable Supply Chain Tracker',
    description:
      'Interactive map and analytics suite monitoring carbon footprint across global supply partners with predictive alerts.',
    impact:
      'Identified 15% reduction opportunities by forecasting logistics emissions five weeks ahead.',
    tags: ['React', 'D3.js', 'GraphQL', 'AWS'],
    link: 'https://example.com/project/supply-chain',
  },
  {
    title: 'Multi-tenant Billing Engine',
    description:
      'Usage-based billing service supporting dynamic pricing tiers, real-time invoicing, and reconciliation tooling.',
    impact: 'Increased revenue capture by 18% for a SaaS platform transitioning to pay-as-you-go pricing.',
    tags: ['Go', 'gRPC', 'Kafka', 'Redis'],
    link: 'https://example.com/project/billing-engine',
  },
  {
    title: 'Observability Command Center',
    description:
      'Unified tracing, logging, and metrics console with adaptive alerting and service dependency visualization.',
    impact: 'Reduced MTTR from 46 minutes to 12 minutes by empowering on-call teams with actionable insights.',
    tags: ['React', 'Typescript', 'OpenTelemetry', 'InfluxDB'],
    link: 'https://example.com/project/observability-center',
  },
  {
    title: 'Composable Design System',
    description:
      'Cross-platform component library with accessibility baked in, serving web, native, and embedded devices.',
    impact: 'Cut prototype-to-production time by 42% across three product lines with a unified toolkit.',
    tags: ['Storybook', 'React', 'Figma', 'Accessibility'],
    link: 'https://example.com/project/design-system',
  },
  {
    title: 'Predictive Incident Assistant',
    description:
      'ML-backed escalation assistant that clusters signals across observability, SLOs, and customer support queues.',
    impact: 'Flagged 76% of critical incidents before customer impact during beta rollout.',
    tags: ['Python', 'Scikit-learn', 'Airflow', 'SLO'],
    link: 'https://example.com/project/incident-assistant',
  },
  {
    title: 'AI Pair Programming Coach',
    description:
      'Embedded IDE assistant that suggests refactors, test cases, and documentation aligned with team practices.',
    impact: 'Accelerated code review cycles by 35% while bumping test coverage by 12 points.',
    tags: ['LLM', 'TypeScript', 'VS Code', 'LangChain'],
    link: 'https://example.com/project/ai-coach',
  },
  {
    title: 'Data Governance Hub',
    description:
      'Self-service catalog of datasets, lineage, and quality dashboards with role-based access controls.',
    impact: 'Enabled 400+ analysts to discover and trust data assets with automated compliance reporting.',
    tags: ['React', 'Hasura', 'GraphQL', 'dbt'],
    link: 'https://example.com/project/governance-hub',
  },
  {
    title: 'Developer Portal 2.0',
    description:
      'API documentation and onboarding experience with machine-generated quickstarts and interactive sandboxes.',
    impact: 'Onboarding time for partner engineers dropped from weeks to three days.',
    tags: ['Next.js', 'MDX', 'OpenAPI', 'Auth0'],
    link: 'https://example.com/project/dev-portal',
  },
  {
    title: 'Edge Analytics Platform',
    description:
      'Distributed data processing pipeline pushing inference to IoT gateways with real-time dashboards.',
    impact: 'Cut latency by 68% for industrial sensors streaming 24/7 telemetry.',
    tags: ['Rust', 'Apache Flink', 'Grafana', 'MQTT'],
    link: 'https://example.com/project/edge-analytics',
  },
  {
    title: 'Privacy-first Identity Vault',
    description:
      'Encrypted identity provider with hardware-backed key rotation and fine-grained consent workflows.',
    impact: 'Met stringent banking compliance requirements while improving sign-in success rate by 22%.',
    tags: ['Kotlin', 'React', 'Cognito', 'KMS'],
    link: 'https://example.com/project/identity-vault',
  },
  {
    title: 'Collaborative Roadmap Planner',
    description:
      'Interactive roadmap planning suite aligning product, engineering, and business forecasts with shared visibility.',
    impact: 'Improved confidence in quarterly planning by 30% thanks to scenario modeling and dependencies map.',
    tags: ['React', 'Recoil', 'Notion API', 'Tailwind'],
    link: 'https://example.com/project/roadmap-planner',
  },
  {
    title: 'Customer Feedback Intelligence',
    description:
      'NLP-powered aggregation of support tickets, survey responses, and community posts into sentiment insights.',
    impact: 'Surfaced emerging product issues 3 weeks earlier, guiding roadmap prioritization.',
    tags: ['Python', 'Transformers', 'BigQuery', 'Looker'],
    link: 'https://example.com/project/feedback-intel',
  },
  {
    title: 'Composable Commerce Engine',
    description:
      'Headless commerce backend with plugin marketplace, multi-region deployments, and SLA-backed APIs.',
    impact: 'Powered 9-figure GMV for brands with global storefronts and flash-sale resiliency.',
    tags: ['Node.js', 'GraphQL', 'Redis', 'CloudFront'],
    link: 'https://example.com/project/commerce-engine',
  },
  {
    title: 'Real-time Workforce Planner',
    description:
      'Scenario planning tool that syncs staffing forecasts, PTO data, and hiring pipelines against business targets.',
    impact: 'Helped operations leaders rebalance capacity, cutting overtime costs by 24%.',
    tags: ['Go', 'React', 'Snowflake', 'Metabase'],
    link: 'https://example.com/project/workforce-planner',
  },
  {
    title: 'SRE Runbook Platform',
    description:
      'Dynamic runbooks with live telemetry embeds, incident timelines, and postmortem automation.',
    impact: 'Improved on-call confidence scores by 40% while standardizing retrospectives.',
    tags: ['Next.js', 'Typescript', 'MDX', 'PagerDuty'],
    link: 'https://example.com/project/runbook-platform',
  },
  {
    title: 'AI-powered Resume Screener',
    description:
      'Bias-aware candidate screening tool integrating with ATS systems and providing explainable recommendations.',
    impact: 'Cut recruiter review time by 55% while improving diversity in interview pipelines.',
    tags: ['Python', 'FastAPI', 'Pinecone', 'React'],
    link: 'https://example.com/project/resume-screener',
  },
  {
    title: 'Streaming Media Optimizer',
    description:
      'Adaptive bitrate orchestration service with predictive caching and QoS insights.',
    impact: 'Boosted global playback success to 99.2% during peak events.',
    tags: ['Rust', 'HLS', 'AWS Lambda', 'CloudWatch'],
    link: 'https://example.com/project/media-optimizer',
  },
  {
    title: 'FinOps Insight Platform',
    description:
      'Budget guardrails, anomaly detection, and rightsizing recommendations delivered to platform teams.',
    impact: 'Saved $1.2M annually by aligning provisioning with usage patterns.',
    tags: ['React', 'Python', 'Athena', 'AWS'],
    link: 'https://example.com/project/finops-platform',
  },
  {
    title: 'Autonomous Testing Grid',
    description:
      'Distributed test execution environment orchestrating flaky test detection and intelligent retries.',
    impact: 'Cut regression suite time from 90 to 18 minutes while improving pass reliability.',
    tags: ['Cypress', 'Playwright', 'Kubernetes', 'Go'],
    link: 'https://example.com/project/testing-grid',
  },
  {
    title: 'Immersive Learning Platform',
    description:
      'WebXR modules for technical onboarding with collaborative labs and progress analytics.',
    impact: 'Achieved 96% completion rates for complex product training.',
    tags: ['Three.js', 'React', 'WebXR', 'Firebase'],
    link: 'https://example.com/project/learning-platform',
  },
  {
    title: 'Climate Risk Intelligence',
    description:
      'Geospatial pipeline combining satellite imagery with climate models to forecast asset risks.',
    impact: 'Enabled insurers to adjust portfolios and mitigate $250M in emerging exposure.',
    tags: ['Python', 'GDAL', 'AWS Batch', 'React'],
    link: 'https://example.com/project/climate-risk',
  },
  {
    title: 'Secure Data Mesh',
    description:
      'Domain-oriented data sharing platform with federated governance and automated policy enforcement.',
    impact: 'Empowered product squads to ship analytics features six weeks faster on average.',
    tags: ['Kubernetes', 'Istio', 'dbt', 'React'],
    link: 'https://example.com/project/data-mesh',
  },
  {
    title: 'Voice-driven Support Agent',
    description:
      'Conversational AI interface that triages customer issues, integrates with CRM, and learns from feedback loops.',
    impact: 'Deflected 45% of inbound support volume while boosting CSAT by 18 points.',
    tags: ['Node.js', 'Twilio', 'LLM', 'React'],
    link: 'https://example.com/project/support-agent',
  },
  {
    title: 'Quantum-dev Sandbox',
    description:
      'Interactive learning environment for quantum algorithms with simulated qubits and visual debugging.',
    impact: 'Accelerated R&D onboarding for a quantum research lab by 3x.',
    tags: ['Python', 'Qiskit', 'React', 'Tailwind'],
    link: 'https://example.com/project/quantum-sandbox',
  },
]

const skillGroups = [
  {
    title: 'Languages',
    items: ['TypeScript', 'Python', 'Go', 'Rust', 'SQL'],
  },
  {
    title: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Express', 'FastAPI', 'Tailwind'],
  },
  {
    title: 'Platforms & Tooling',
    items: ['AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Terraform'],
  },
  {
    title: 'Practices',
    items: ['System Design', 'Observability', 'CI/CD', 'Mentorship', 'Accessibility'],
  },
]

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@devportfolio.dev',
    href: 'mailto:hello@devportfolio.dev',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@dev-portfolio',
    href: 'https://github.com/dev-portfolio',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'in/dev-portfolio',
    href: 'https://www.linkedin.com/in/dev-portfolio',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/50 p-8 transition-transform hover:-translate-y-1 hover:border-indigo-500/60">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 transition-transform group-hover:scale-125" />
      <div className="relative space-y-4">
        <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
        <p className="text-sm text-slate-300">{project.description}</p>
        <p className="text-sm text-slate-400">{project.impact}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
        >
          Explore case study
          <ArrowDown className="h-4 w-4 rotate-[-90deg]" />
        </a>
      </div>
    </article>
  )
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(2)

  const slides = useMemo(() => {
    const chunkSize = itemsPerSlide
    const grouped: Project[][] = []
    for (let i = 0; i < projects.length; i += chunkSize) {
      grouped.push(projects.slice(i, i + chunkSize))
    }
    return grouped
  }, [itemsPerSlide])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2)
      } else {
        setItemsPerSlide(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCurrentSlide(0)
  }, [itemsPerSlide])

  const goToSlide = (index: number) => {
    const normalized = (index + slides.length) % slides.length
    setCurrentSlide(normalized)
  }

  const nextSlide = () => goToSlide(currentSlide + 1)
  const prevSlide = () => goToSlide(currentSlide - 1)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f2937,_rgba(15,23,42,0.85))]" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            href="#hero"
          >
            <Rocket className="h-6 w-6 text-indigo-400" />
            <span>Dev Portfolio</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 sm:flex">
            <a className="hover:text-indigo-300" href="#about">
              About
            </a>
            <a className="hover:text-indigo-300" href="#projects">
              Projects
            </a>
            <a className="hover:text-indigo-300" href="#skills">
              Skills
            </a>
            <a className="hover:text-indigo-300" href="#contact">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16 sm:py-24">
        <section id="hero" className="flex flex-col gap-10 pt-6 sm:flex-row sm:items-center">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">
              <Briefcase className="h-4 w-4" />
              Principal Software Engineer
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Building resilient platforms and delightful developer tools.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                I architect systems that scale smoothly, mentor engineering teams, and
                deliver product experiences that developers love. Currently focused on
                realtime collaboration, observability, and AI-assisted workflows.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                View Projects
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-200"
              >
                Let&apos;s Collaborate
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Remote · San Francisco, CA
              </span>
              <span className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Available for consulting Q1 2026
              </span>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-2xl" />
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-indigo-900/20">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-300">Latest highlights</p>
              <ul className="mt-6 space-y-5 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                  Rolled out platform-wide feature flags powering <span className="font-semibold text-white">12 teams</span> with zero downtime.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                  Launched developer enablement guild, onboarding <span className="font-semibold text-white">30 engineers</span> in 4 weeks.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                  Led cloud cost initiative saving <span className="font-semibold text-white">$480k annually</span> via workload right-sizing.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
              About
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Crafting reliable software with curiosity and care.</h2>
          </div>
          <div className="grid gap-8 text-base text-slate-300 sm:grid-cols-2">
            <p>
              Over the last decade I&apos;ve partnered with product, design, and infrastructure teams to deliver ambitious digital experiences. From greenfield startups to enterprise-scale platforms, I bridge strategy and execution while keeping teams energized.
            </p>
            <p>
              My toolkit balances deep technical chops with empathetic leadership. I love untangling complex problems, designing elegant architectures, and helping peers level up through mentorship and collaborative rituals.
            </p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 text-sm text-slate-300 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Experience</p>
              <p className="mt-2 text-lg font-semibold text-white">12+ years</p>
              <p className="mt-1 text-slate-400">Leading cross-functional engineering teams.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Specialty</p>
              <p className="mt-2 text-lg font-semibold text-white">Platform & DX</p>
              <p className="mt-1 text-slate-400">Observability, tooling, and developer productivity.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Mindset</p>
              <p className="mt-2 text-lg font-semibold text-white">Product-first</p>
              <p className="mt-1 text-slate-400">Shipping impact-driven outcomes with measurable results.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 space-y-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Projects</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Selected work that blends strategy and execution.</h2>
            <p className="max-w-3xl text-base text-slate-300">
              A sampling of platform initiatives, developer tooling, and data-rich experiences that showcase my approach to building thoughtful products end-to-end.
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6">
              <div
                className="flex gap-6 transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={`slide-${index}`} className="grid min-w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {slide.map((project) => (
                      <ProjectCard key={project.title} project={project} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80 text-slate-300 transition hover:border-indigo-500/60 hover:text-indigo-200"
                  aria-label="Previous project group"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80 text-slate-300 transition hover:border-indigo-500/60 hover:text-indigo-200"
                  aria-label="Next project group"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition ${
                      index === currentSlide
                        ? 'w-10 bg-indigo-400'
                        : 'w-4 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to project group ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 space-y-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Skills</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Tools and practices I bring to every engagement.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 space-y-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Contact</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Let&apos;s build something remarkable together.</h2>
            <p className="max-w-2xl text-base text-slate-300">
              I love partnering on platform strategy, developer experience, and data-informed products. Drop a note and I&apos;ll respond within two business days.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <form className="space-y-5 rounded-3xl border border-slate-800/60 bg-slate-900/40 p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Name</span>
                  <input
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                    placeholder="How should I call you?"
                    type="text"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Email</span>
                  <input
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                    placeholder="you@company.com"
                    type="email"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Project details</span>
                <textarea
                  className="min-h-[120px] w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  placeholder="Tell me about the problem you&apos;re solving..."
                />
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Send message
                <Send className="h-4 w-4" />
              </button>
            </form>
            <aside className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-900/50 p-8">
              <h3 className="text-lg font-semibold text-white">Reach out directly</h3>
              <ul className="space-y-4 text-sm text-slate-300">
                {contactMethods.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="h-5 w-5 text-indigo-300" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">{label}</p>
                        <p className="text-sm font-medium text-white">{value}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dev Portfolio. Crafted with curiosity and care.</p>
          <div className="flex gap-4">
            <a className="hover:text-indigo-300" href="https://github.com/dev-portfolio" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
            <a className="hover:text-indigo-300" href="https://www.linkedin.com/in/dev-portfolio" target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" />
            </a>
            <a className="hover:text-indigo-300" href="mailto:hello@devportfolio.dev">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
