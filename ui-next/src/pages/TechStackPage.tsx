import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function TechStackPage() {
  return (
    <main className="pt-14">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10
            text-indigo-300 text-[11px] font-mono uppercase tracking-wider mb-4">
            Tech Stack
          </span>
          <h1 className="text-4xl font-bold text-[#f1f1f5] mb-3">Every tool, and why</h1>
          <p className="text-[#5a5a72] text-base leading-relaxed max-w-2xl">
            Nothing picked arbitrarily. Each dependency solves a specific production problem —
            here's the reasoning behind the choices.
          </p>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#5a5a72]">{cat.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.items.map((item) => (
                  <StackCard key={item.name} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Versions snapshot */}
        <div className="mt-16 p-6 rounded-2xl border border-[#2a2a3a] bg-[#0d0d14]">
          <h3 className="text-sm font-semibold text-[#f1f1f5] mb-4 font-mono">Pinned versions (pyproject.toml)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VERSIONS.map(([pkg, ver]) => (
              <div key={pkg} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111118] border border-[#2a2a3a]">
                <span className="text-[11px] font-mono text-[#8b8ba7]">{pkg}</span>
                <span className="text-[11px] font-mono text-indigo-400">{ver}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-semibold transition-all duration-150 no-underline">
            Try the live demo
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function StackCard({ name, version, role, why, url, badge }: {
  name: string; version?: string; role: string; why: string; url?: string; badge?: string
}) {
  return (
    <div className="p-4 rounded-xl border border-[#2a2a3a] bg-[#0d0d14] hover:border-indigo-500/25 transition-colors duration-150 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#f1f1f5]">{name}</span>
          {version && (
            <span className="px-1.5 py-0.5 rounded bg-[#1a1a24] text-[9px] font-mono text-[#5a5a72] border border-[#2a2a3a]">
              {version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono border border-indigo-500/25 text-indigo-400 bg-indigo-500/10">
              {badge}
            </span>
          )}
          {url && (
            <a href={url} target="_blank" rel="noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5a5a72] hover:text-indigo-400">
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[#5a5a72] mb-1">{role}</p>
      <p className="text-[11px] text-[#3a3a4a] leading-relaxed italic">→ {why}</p>
    </div>
  )
}

const CATEGORIES = [
  {
    label: 'Orchestration',
    dot: 'bg-indigo-400',
    items: [
      { name: 'LangGraph', version: '1.1.10', role: 'Agentic state machine with cyclic graph execution', why: 'Deterministic routing between nodes — can loop, branch, and carry state unlike linear chains', badge: 'Core' },
      { name: 'LangChain', version: '1.2.18', role: 'LLM abstraction and prompt composition', why: 'Standardized LLM interface lets us swap models without touching node logic' },
      { name: 'FastAPI', version: '0.136.1', role: 'Production async API server', why: 'Auto-generates OpenAPI docs, validates requests via Pydantic, handles lifespan events cleanly' },
      { name: 'Uvicorn', version: '0.46.0', role: 'ASGI server for FastAPI', why: 'Industry-standard for serving FastAPI in production containers' },
    ],
  },
  {
    label: 'LLM & Gateway',
    dot: 'bg-yellow-400',
    items: [
      { name: 'Portkey', version: '2.3.0', role: 'Unified LLM gateway with fallback + cache + retry', why: 'One config handles routing, caching, and retries — nodes stay model-agnostic', badge: 'Gateway' },
      { name: 'Groq', role: 'Inference provider (Llama 3.3 70B + Llama 3.1 8B)', why: 'Sub-second token generation on LPU hardware — critical for responsive UX' },
      { name: 'langchain-openai', version: '1.2.1', role: 'OpenAI-compatible LLM adapter for Portkey proxy', why: 'ChatGroq doesn\'t support custom base_url — ChatOpenAI does, making it the right Portkey adapter' },
    ],
  },
  {
    label: 'Vector Search & Embeddings',
    dot: 'bg-blue-400',
    items: [
      { name: 'Qdrant', version: '1.17.1', role: 'Cloud-hosted vector database', why: 'Native cosine similarity, typed payloads, and the modern query_points API — production-ready OOB' },
      { name: 'Gemini Embeddings', role: 'gemini-embedding-2-preview, 3072-dim', why: 'Highest-quality semantic vectors for dense technical documentation', badge: 'Primary' },
      { name: 'sentence-transformers', version: '3.2.1', role: 'Local embedding fallback (768-dim)', why: 'Rate-limit resilience — automatically used when Gemini quota is exhausted' },
      { name: 'FlashRank', role: 'ONNX Cross-Encoder reranker (ms-marco-MiniLM)', why: 'Reranks top-15 to top-5 locally with zero API cost and millisecond latency', badge: 'Offline' },
    ],
  },
  {
    label: 'Safety',
    dot: 'bg-purple-400',
    items: [
      { name: 'NeMo Guardrails', version: '0.21.0', role: 'Input/output safety gate (Colang DSL)', why: 'Structured flow-based intent matching is structurally harder to bypass than prompt-based filters', badge: 'Gate' },
    ],
  },
  {
    label: 'Observability',
    dot: 'bg-green-400',
    items: [
      { name: 'Pydantic Logfire', version: '4.32.1', role: 'Distributed tracing with structured spans', why: 'Native FastAPI + requests instrumentation — zero-config span propagation across services' },
      { name: 'LangSmith', version: '0.8.3', role: 'LangGraph agent trace visualization', why: 'First-class LangGraph support — sees inside node transitions and state diffs' },
    ],
  },
  {
    label: 'Evaluation',
    dot: 'bg-orange-400',
    items: [
      { name: 'RAGAS', role: '6-metric automated RAG evaluation pipeline', why: 'Measures faithfulness, relevancy, precision, recall, correctness — with LLM-as-judge scoring', badge: 'Eval' },
      { name: 'DeepEval', role: 'Tool correctness scoring (Jaccard similarity)', why: 'Zero-LLM metric for retrieval correctness — no judge bias, fully deterministic' },
    ],
  },
  {
    label: 'Document Ingestion',
    dot: 'bg-cyan-400',
    items: [
      { name: 'pypdf', version: '6.11.0', role: 'PDF text extraction', why: 'Pure Python, no external binaries — works in any container without system dependencies' },
      { name: 'BeautifulSoup4', version: '4.14.3', role: 'HTML parsing', why: 'Handles malformed HTML from scraped docs gracefully' },
      { name: 'python-docx / python-pptx', role: 'Office document parsing', why: 'Covers the full enterprise document set without OCR services' },
    ],
  },
  {
    label: 'Frontend',
    dot: 'bg-pink-400',
    items: [
      { name: 'React 19', role: 'UI framework', why: 'Latest concurrent mode features + compiler optimizations' },
      { name: 'Vite 8', role: 'Build tool + dev server with HMR', why: 'Sub-second cold starts, native ESM, and Tailwind v4 plugin support' },
      { name: 'Tailwind CSS v4', role: 'Utility-first styling', why: 'Zero-config CSS with the new @theme API — no tailwind.config.js needed' },
      { name: 'react-router-dom', role: 'Client-side routing', why: 'Multi-page navigation without a server — SPA with back/forward support' },
    ],
  },
]

const VERSIONS: [string, string][] = [
  ['langgraph', '1.1.10'],
  ['langchain', '1.2.18'],
  ['fastapi', '0.136.1'],
  ['portkey-ai', '2.3.0'],
  ['qdrant-client', '1.17.1'],
  ['nemoguardrails', '0.21.0'],
  ['logfire', '4.32.1'],
  ['langsmith', '0.8.3'],
  ['ragas', 'latest'],
  ['pypdf', '6.11.0'],
  ['sentence-transformers', '3.2.1'],
  ['pydantic', '2.13.4'],
]
