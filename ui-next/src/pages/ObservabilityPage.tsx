import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, ZoomIn, X } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   Data — each tool has a color accent, description, and two screenshots
───────────────────────────────────────────────────────────────────────────── */
const TOOLS = [
  {
    id: 'langsmith',
    name: 'LangSmith',
    badge: 'Agent Tracing',
    accent: 'indigo',
    url: 'https://smith.langchain.com',
    accentClasses: {
      badge: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-300',
      dot: 'bg-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/5',
      tag: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      headerBorder: 'border-indigo-500/15',
      pill: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300',
    },
    summary:
      'Every LangGraph node transition — Planner, Retriever, Responder — is captured as a named trace in LangSmith. You can drill into the exact prompt sent to Groq, the raw output, token cost, and latency for any run.',
    what: [
      'Full run list with ChatOpenAI (Planner) and ChatGroq (Responder) spans',
      'Per-trace waterfall — node execution order, durations, and model used',
      'Input / Output diff — exact system prompt and LLM response',
      'Token usage and cost ($0.0007 per technical query)',
      'Error highlighting — OpenAIModelNotFoundError surfaced instantly',
    ],
    screenshots: [
      {
        src: '/assets/Langsmith/Langsmith1.png',
        label: 'Trace List',
        caption:
          'Live trace feed showing ChatOpenAI (Planner) and ChatGroq (Responder) runs. Every query generates 2–3 spans. Latencies range from 0.37s (conversational) to 12.72s (complex technical retrieval). The orange badge flags a slow run; red flags an exception.',
      },
      {
        src: '/assets/Langsmith/Langsmith2.png',
        label: 'Trace Detail',
        caption:
          'Drill-down for "How does BGP routing work?" — shows the full waterfall (2.42s total), the exact Planner intent classification output, and the Responder answer. Model: openai/gpt-oss-120b via Portkey. Token cost: $0.0007.',
      },
    ],
  },
  {
    id: 'logfire',
    name: 'Pydantic Logfire',
    badge: 'Infrastructure Spans',
    accent: 'orange',
    url: 'https://logfire.pydantic.dev',
    accentClasses: {
      badge: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
      dot: 'bg-orange-400',
      border: 'border-orange-500/20',
      glow: 'hover:border-orange-500/40 hover:shadow-orange-500/5',
      tag: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      headerBorder: 'border-orange-500/15',
      pill: 'bg-orange-500/10 border-orange-500/25 text-orange-300',
    },
    summary:
      'Logfire wraps every FastAPI request in a root span and nests child spans for each pipeline stage — Guardrails Check, Planner Decision, Knowledge Retrieval, LLM Synthesis. The timeline gives wall-clock durations so you can see exactly where latency is spent.',
    what: [
      'Root span per HTTP request with nested child spans per pipeline stage',
      'Guardrails Check → Planner Decision → Knowledge Retrieval → LLM Synthesis visible as a waterfall',
      'Duration bars per span — pinpoint slow stages at a glance',
      'Exception capture with full code location (file, function, line)',
      'Qdrant error detail — INVALID_ARGUMENT embedding error surfaced with raw attributes',
    ],
    screenshots: [
      {
        src: '/assets/logfire/LogFire1.png',
        label: 'Live Span Timeline',
        caption:
          'Full pipeline waterfall for multiple concurrent sessions (Aug 29 – Sep 12). Each User Chat Interaction root span nests Guardrails Check (2–10s), Planner Decision (~1–2s), Knowledge Retrieval (~3s), and LLM Synthesis (~1–3s). Exception spans are highlighted in red.',
      },
      {
        src: '/assets/logfire/LogFire2.png',
        label: 'Error Span Detail',
        caption:
          'Qdrant Search Failed span expanded — level: Error, service: unknown_service, trace_id and span_id linked for cross-tool correlation. Attributes panel shows the exact GoogleGenerativeAIError (400 INVALID_ARGUMENT) with code location: app/services/retrieval/qdrant_service.py:40.',
      },
    ],
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    badge: 'Vector Database',
    accent: 'pink',
    url: 'https://cloud.qdrant.io',
    accentClasses: {
      badge: 'border-pink-500/25 bg-pink-500/10 text-pink-300',
      dot: 'bg-pink-400',
      border: 'border-pink-500/20',
      glow: 'hover:border-pink-500/40 hover:shadow-pink-500/5',
      tag: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      headerBorder: 'border-pink-500/15',
      pill: 'bg-pink-500/10 border-pink-500/25 text-pink-300',
    },
    summary:
      'The `enterprise_rag` collection in KubeAegis_cluster stores every ingested document chunk as a 3072-dimensional Gemini embedding. Each point carries a JSON payload with `text`, `source`, and `source_type` (true / noisy) so the retriever can distinguish high-signal enterprise docs from noisy background content.',
    what: [
      'Collection: enterprise_rag — hosted on KubeAegis_cluster',
      'Vector length: 3072-dim (Gemini gemini-embedding-2-preview)',
      'Payload schema: { text, source, source_type: "true" | "noisy" }',
      'Points browser — inspect any chunk, its source file, and its raw vector',
      'Graph visualizer — cosine similarity clusters between document chunks',
    ],
    screenshots: [
      {
        src: '/assets/Qdrant/Qdrant1.png',
        label: 'Collection Points Browser',
        caption:
          'enterprise_rag collection in the KubeAegis_cluster. Two representative points shown: a "noisy" chunk from a C++ CppCon talk and a "true" chunk from monitor_job.docx — both with 3072-dim default vectors. The source_type field is what the retriever filters on to prioritise true enterprise docs.',
      },
      {
        src: '/assets/Qdrant/Qdrant2.png',
        label: 'Vector Graph + Similar Points',
        caption:
          'Graph view for a "100G Networking" chunk (source_type: noisy). The right panel lists the 12 most similar points by cosine score — top match at 0.7856, showing strong semantic clustering of networking content regardless of source_type. Used during reranking to understand neighbourhood density.',
      },
    ],
  },
  {
    id: 'portkey',
    name: 'Portkey',
    badge: 'LLM Gateway',
    accent: 'emerald',
    url: 'https://portkey.ai',
    accentClasses: {
      badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
      tag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      headerBorder: 'border-emerald-500/15',
      pill: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
    },
    summary:
      'Portkey sits between the LangGraph nodes and Groq, acting as a unified LLM proxy. It handles automatic fallback routing, semantic caching, retry on 429/503, and per-request cost tracking — all without any changes to the application nodes.',
    what: [
      '147 total requests routed — $0 cost (Groq free tier)',
      '62.5K tokens processed across all runs (14-day window)',
      'P50 latency: 1440ms — includes Planner + Responder round trips',
      '11 cache hits — 89.7% cache speedup, avg cache latency 164.9ms',
      'Cache savings: $0.0007 over 14 days — semantic cache avoids redundant LLM calls',
    ],
    screenshots: [
      {
        src: '/assets/portkey/Portkey1.png',
        label: 'Analytics Overview',
        caption:
          'Portkey Analytics Overview (last 14 days). Cost: $0 — all traffic runs on Groq free tier. 62.5K tokens consumed across 147 requests. P50 latency: 1440ms; peak on Sep 7 near 4000ms during heavy retrieval testing. 3 unique users tracked by thread_id metadata.',
      },
      {
        src: '/assets/portkey/Portkey2.png',
        label: 'Cache Analytics',
        caption:
          'Portkey semantic cache dashboard. 11 cache hits (12% hit rate) with an 89.7% speedup — repeated queries return in 164.9ms instead of ~1440ms. Cache savings: $0.0007. The hit spikes on Sep 6–7 correspond to repeated BGP / Kubernetes test queries during eval runs.',
      },
    ],
  },
] as const

/* ─────────────────────────────────────────────────────────────────────────────
   Lightbox
───────────────────────────────────────────────────────────────────────────── */
function Lightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-[#0d0d14] rounded-2xl border border-[#2a2a3a] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-7 h-7
            rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-[#5a5a72]
            hover:text-[#f1f1f5] hover:bg-[#2a2a3a] transition-all"
        >
          <X size={13} />
        </button>
        <img src={src} alt="screenshot" className="w-full block" />
        <p className="px-5 py-3 text-[12px] text-[#5a5a72] leading-relaxed border-t border-[#2a2a3a]">
          {caption}
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Screenshot card
───────────────────────────────────────────────────────────────────────────── */
function ScreenshotCard({
  src, label, caption, accentClasses,
}: {
  src: string
  label: string
  caption: string
  accentClasses: (typeof TOOLS)[number]['accentClasses']
  onZoom: () => void
}) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      {zoomed && <Lightbox src={src} caption={caption} onClose={() => setZoomed(false)} />}
      <div className={`group flex flex-col rounded-2xl border ${accentClasses.border} bg-[#0d0d14]
        overflow-hidden transition-all duration-200 hover:shadow-lg ${accentClasses.glow}`}>
        {/* Image */}
        <div className="relative overflow-hidden cursor-zoom-in" onClick={() => setZoomed(true)}>
          <img
            src={src}
            alt={label}
            className="w-full block transition-transform duration-300 group-hover:scale-[1.015]"
          />
          {/* Zoom overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200
            flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
              flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm
              border border-white/10 text-white text-[11px] font-medium">
              <ZoomIn size={12} />
              Click to expand
            </div>
          </div>
        </div>
        {/* Caption */}
        <div className={`px-4 py-3 border-t ${accentClasses.headerBorder}`}>
          <span className={`inline-block px-2 py-0.5 rounded-md border text-[9px] font-mono
            uppercase tracking-wider mb-2 ${accentClasses.tag}`}>
            {label}
          </span>
          <p className="text-[12px] text-[#5a5a72] leading-relaxed">{caption}</p>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tool section
───────────────────────────────────────────────────────────────────────────── */
function ToolSection({ tool }: { tool: (typeof TOOLS)[number] }) {
  const { accentClasses } = tool
  return (
    <section id={tool.id} className="scroll-mt-20">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-5 mb-8 border-b ${accentClasses.headerBorder}`}>
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-2 h-2 rounded-full ${accentClasses.dot} shrink-0`} />
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase
              tracking-wider ${accentClasses.badge}`}>
              {tool.badge}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#f1f1f5] mb-2">{tool.name}</h2>
          <p className="text-[13px] text-[#5a5a72] leading-relaxed max-w-2xl">{tool.summary}</p>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2a3a]
            text-[11px] text-[#5a5a72] hover:text-[#f1f1f5] hover:border-[#3a3a4a]
            transition-all duration-150 no-underline mt-1"
        >
          <ExternalLink size={11} />
          <span className="hidden sm:block">Open Dashboard</span>
        </a>
      </div>

      {/* What you can see */}
      <div className="mb-8 p-4 rounded-xl border border-[#2a2a3a] bg-[#0d0d14]">
        <p className="text-[10px] font-mono text-[#3a3a4a] uppercase tracking-widest mb-3">
          What's captured
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tool.what.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${accentClasses.dot}`} />
              <span className="text-[12px] text-[#8b8ba7] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Screenshots — side by side on ≥md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tool.screenshots.map((s) => (
          <ScreenshotCard
            key={s.src}
            src={s.src}
            label={s.label}
            caption={s.caption}
            accentClasses={accentClasses}
            onZoom={() => {}}
          />
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function ObservabilityPage() {
  return (
    <main className="pt-14">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── Page header ── */}
        <div className="mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10
            text-indigo-300 text-[11px] font-mono uppercase tracking-wider mb-4">
            Observability
          </span>
          <h1 className="text-4xl font-bold text-[#f1f1f5] mb-4">
            Full-stack visibility into every query
          </h1>
          <p className="text-[#5a5a72] text-base leading-relaxed max-w-2xl mb-8">
            KubeAegis is instrumented end-to-end — from the HTTP request through every LangGraph
            node to the LLM response. Four dashboards give you a complete picture: agent logic,
            infrastructure spans, vector storage, and LLM gateway metrics.
          </p>

          {/* Tool quick-jump pills */}
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono
                  transition-all duration-150 no-underline ${t.accentClasses.pill}
                  hover:opacity-80`}
              >
                {t.name}
              </a>
            ))}
          </div>
        </div>

        {/* ── Observability stack overview bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {[
            { label: 'LangSmith', sub: 'Agent node traces', color: 'border-indigo-500/20 bg-indigo-500/5' },
            { label: 'Logfire', sub: 'FastAPI + span tree', color: 'border-orange-500/20 bg-orange-500/5' },
            { label: 'Qdrant Cloud', sub: 'Vector point inspector', color: 'border-pink-500/20 bg-pink-500/5' },
            { label: 'Portkey', sub: 'LLM cost + cache', color: 'border-emerald-500/20 bg-emerald-500/5' },
          ].map((item) => (
            <div key={item.label}
              className={`p-4 rounded-xl border ${item.color} text-center`}>
              <p className="text-sm font-semibold text-[#f1f1f5] mb-0.5">{item.label}</p>
              <p className="text-[11px] text-[#5a5a72]">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tool sections ── */}
        <div className="space-y-20">
          {TOOLS.map((tool) => (
            <ToolSection key={tool.id} tool={tool} />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-20 pt-10 border-t border-[#2a2a3a] flex flex-col sm:flex-row
          items-center justify-between gap-4">
          <p className="text-[13px] text-[#5a5a72] max-w-md">
            Every trace shown here was generated by real queries to the live KubeAegis pipeline.
            Fire one yourself and watch it appear in LangSmith and Logfire within seconds.
          </p>
          <Link
            to="/chat"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600
              hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-150
              no-underline shadow-lg shadow-indigo-500/20"
          >
            Generate a trace
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </main>
  )
}
