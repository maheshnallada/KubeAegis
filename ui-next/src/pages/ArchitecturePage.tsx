import { Link } from 'react-router-dom'
import { ArrowRight, Database, Shield, GitBranch, Zap, BarChart3, Server } from 'lucide-react'

export default function ArchitecturePage() {
  return (
    <main className="pt-14">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10
            text-indigo-300 text-[11px] font-mono uppercase tracking-wider mb-4">
            System Architecture
          </span>
          <h1 className="text-4xl font-bold text-[#f1f1f5] mb-3">How it's built</h1>
          <p className="text-[#5a5a72] text-base leading-relaxed max-w-2xl">
            A layered system where each component has a single responsibility.
            No spaghetti — every service, gateway, and node is independently testable and replaceable.
          </p>
        </div>

        {/* Layer diagram */}
        <div className="space-y-3 mb-16">
          <LayerRow
            icon={<Server size={15} className="text-blue-400" />}
            label="Interface Layer"
            color="border-blue-500/25 bg-blue-500/5"
            items={['React + Vite UI (this app)', 'FastAPI /query endpoint', 'GET /graph — Mermaid PNG']}
          />
          <Arrow />
          <LayerRow
            icon={<Shield size={15} className="text-purple-400" />}
            label="Safety Gate"
            color="border-purple-500/25 bg-purple-500/5"
            items={['NeMo Guardrails (Colang DSL)', 'Embeddings-based intent matching', 'Blocks: off-topic, jailbreak, injection']}
          />
          <Arrow />
          <LayerRow
            icon={<GitBranch size={15} className="text-indigo-400" />}
            label="LangGraph Agent"
            color="border-indigo-500/25 bg-indigo-500/5"
            items={['Planner Node — intent classification', 'Retriever Node — vector search', 'Responder Node — answer synthesis', 'MemorySaver — per-thread history']}
          />
          <Arrow />
          <LayerRow
            icon={<Database size={15} className="text-cyan-400" />}
            label="Retrieval Layer"
            color="border-cyan-500/25 bg-cyan-500/5"
            items={['Qdrant Cloud — cosine similarity search', 'Gemini embeddings — 3072-dim vectors', 'FlashRank ONNX — Cross-Encoder reranking']}
          />
          <Arrow />
          <LayerRow
            icon={<Zap size={15} className="text-yellow-400" />}
            label="LLM Gateway"
            color="border-yellow-500/25 bg-yellow-500/5"
            items={['Portkey — unified proxy', 'Primary: Groq Llama 3.3 70B', 'Fallback: Groq Llama 3.1 8B', 'Semantic cache + retry on 429/503']}
          />
          <Arrow />
          <LayerRow
            icon={<BarChart3 size={15} className="text-green-400" />}
            label="Observability"
            color="border-green-500/25 bg-green-500/5"
            items={['Pydantic Logfire — distributed spans', 'LangSmith — agent traces', 'Every node wrapped in logfire.span()']}
          />
        </div>

        {/* Design decisions */}
        <h2 className="text-xl font-bold text-[#f1f1f5] mb-6">Key design decisions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {DECISIONS.map((d) => (
            <DecisionCard key={d.q} question={d.q} answer={d.a} />
          ))}
        </div>

        {/* Data flow */}
        <h2 className="text-xl font-bold text-[#f1f1f5] mb-6">Data ingestion pipeline</h2>
        <div className="p-6 rounded-2xl border border-[#2a2a3a] bg-[#0d0d14] mb-12">
          <div className="flex items-center gap-3 flex-wrap">
            {['Raw Documents', '→', 'Local Parsing', '→', 'Paragraph Chunks', '→', 'Gemini Embed', '→', 'Qdrant Upsert', '→', 'JSON Cache'].map((t, i) => (
              t === '→' ? (
                <span key={i} className="text-[#2a2a3a] text-sm font-mono">→</span>
              ) : (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]
                  text-[12px] font-mono text-[#8b8ba7]">{t}</span>
              )
            ))}
          </div>
          <p className="text-[12px] text-[#5a5a72] mt-4 leading-relaxed">
            Supports PDF (pypdf), HTML (BeautifulSoup), DOCX (python-docx), PPTX (python-pptx), TXT.
            Chunked at 1500-char paragraph boundaries. Each chunk stored with{' '}
            <code className="text-indigo-300 font-mono text-[11px]">text, source, source_type</code> payload in Qdrant.
          </p>
        </div>

        <div className="flex justify-center">
          <Link to="/stack"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-semibold transition-all duration-150 no-underline">
            Explore the tech stack
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-3 bg-[#2a2a3a]" />
        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#2a2a3a]" />
      </div>
    </div>
  )
}

function LayerRow({ icon, label, color, items }: {
  icon: React.ReactNode; label: string; color: string; items: string[]
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${color}`}>
      <div className="flex items-center gap-2 w-40 shrink-0 pt-0.5">
        {icon}
        <span className="text-[11px] font-mono text-[#8b8ba7] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="px-2.5 py-1 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]
            text-[11px] text-[#8b8ba7] font-mono">{item}</span>
        ))}
      </div>
    </div>
  )
}

function DecisionCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-5 rounded-xl border border-[#2a2a3a] bg-[#0d0d14]">
      <p className="text-sm font-semibold text-indigo-300 mb-2">{question}</p>
      <p className="text-[12px] text-[#5a5a72] leading-relaxed">{answer}</p>
    </div>
  )
}

const DECISIONS = [
  {
    q: 'Why ChatOpenAI instead of ChatGroq for the gateway?',
    a: 'Portkey is an OpenAI-compatible proxy. ChatGroq is hardwired to Groq\'s API and ignores base_url. ChatOpenAI supports custom base_url + headers, making it the correct adapter for any proxy gateway.',
  },
  {
    q: 'Why FlashRank instead of a cloud reranker?',
    a: 'Zero network latency, no API cost, and fully offline. FlashRank uses a quantized ONNX Cross-Encoder that runs in milliseconds locally — better precision than cosine similarity without a round trip.',
  },
  {
    q: 'Why MemorySaver over a database checkpointer?',
    a: 'In-process memory is sufficient for demo scale. The architecture supports a drop-in swap to LangGraph\'s PostgreSQL checkpointer (already in pyproject.toml) for production persistence.',
  },
  {
    q: 'Why NeMo Guardrails instead of prompt-based filtering?',
    a: 'Prompt-based filters are easily bypassed. Colang DSL defines explicit flows with embeddings-based intent matching at a 0.6 similarity threshold — structurally harder to jailbreak.',
  },
  {
    q: 'Why Gemini embeddings at 3072 dimensions?',
    a: 'Higher dimensionality captures richer semantic relationships in dense technical documentation. Includes a sentence-transformers fallback (768-dim) for rate-limit resilience.',
  },
  {
    q: 'Why Portkey instead of calling Groq directly?',
    a: 'Portkey adds fallback routing, semantic caching, retry logic, and per-request metadata in one gateway — without touching the LangGraph nodes. The nodes stay model-agnostic.',
  },
]
