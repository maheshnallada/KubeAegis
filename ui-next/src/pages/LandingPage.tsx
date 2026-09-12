import { Link } from 'react-router-dom'
import {
  Shield, Zap, Database, GitBranch, BarChart3, ArrowRight,
  CheckCircle, ChevronRight, Cpu, Network, Lock, Search,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="pt-14">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <PipelineSection />
      <CapabilitiesSection />
      <CTASection />
    </main>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[88vh] px-6 text-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Production-grade · Agentic RAG System
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-[#f1f1f5] leading-tight tracking-tight mb-6">
          Enterprise Knowledge
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
            Powered by AI Agents
          </span>
        </h1>

        <p className="text-lg text-[#8b8ba7] max-w-2xl mx-auto leading-relaxed mb-10">
          A full-stack agentic RAG pipeline with LangGraph orchestration, NeMo Guardrails,
          Portkey LLM Gateway, Qdrant vector search, and FlashRank reranking — built to answer
          Kubernetes, Intel, and Networking questions at enterprise scale.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-semibold transition-all duration-150 no-underline shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          >
            Try Live Demo
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/architecture"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2a2a3a] bg-[#111118]
              hover:border-indigo-500/30 hover:bg-indigo-500/5 text-[#f1f1f5] text-sm font-medium
              transition-all duration-150 no-underline"
          >
            View Architecture
            <ChevronRight size={15} className="text-[#5a5a72]" />
          </Link>
        </div>

        {/* Mini pipeline preview */}
        <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
          {['User Query', '→', 'Guardrails', '→', 'Planner', '→', 'Retriever', '→', 'Reranker', '→', 'Responder'].map((item, i) => (
            item === '→' ? (
              <span key={i} className="text-[#2a2a3a] text-lg">→</span>
            ) : (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-[#111118] border border-[#2a2a3a]
                text-[11px] font-mono text-[#8b8ba7]">
                {item}
              </span>
            )
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Stats Bar ─────────────────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: '3072-dim', label: 'Gemini Embeddings' },
    { value: 'Llama 3.3', label: '70B Primary LLM' },
    { value: 'FlashRank', label: 'Local Reranking' },
    { value: '6 Metrics', label: 'RAGAS Evaluation' },
    { value: 'NeMo', label: 'Guardrails Gate' },
    { value: 'Portkey', label: 'LLM Gateway' },
  ]
  return (
    <div className="border-y border-[#2a2a3a] bg-[#0d0d14]">
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-x divide-[#2a2a3a]">
        {stats.map((s) => (
          <div key={s.label} className="text-center px-2">
            <p className="text-lg font-bold text-indigo-300 font-mono">{s.value}</p>
            <p className="text-[11px] text-[#5a5a72] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Features ──────────────────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <GitBranch size={20} className="text-indigo-400" />,
      title: 'LangGraph Agentic Core',
      desc: 'State-machine orchestration with a Planner → Retriever → Responder pipeline. Intent classification routes conversational queries directly to memory, skipping unnecessary retrieval.',
      tags: ['LangGraph', 'MemorySaver', 'StateGraph'],
    },
    {
      icon: <Shield size={20} className="text-purple-400" />,
      title: 'NeMo Guardrails Gate',
      desc: 'Every request passes through a Colang-based safety gate before touching the RAG pipeline. Blocks jailbreaks, off-topic queries, and prompt injections with embeddings-based matching.',
      tags: ['NeMo', 'Colang DSL', 'Input Safety'],
    },
    {
      icon: <Zap size={20} className="text-yellow-400" />,
      title: 'Portkey LLM Gateway',
      desc: 'Unified proxy with automatic fallback from Llama 3.3 70B → Llama 3.1 8B on failure. Semantic caching, retry on 429/503, and per-request metadata for full observability.',
      tags: ['Portkey', 'Fallback', 'Cache'],
    },
    {
      icon: <Database size={20} className="text-blue-400" />,
      title: 'Qdrant + FlashRank',
      desc: 'Qdrant Cloud vector database with Gemini 3072-dim embeddings for recall. FlashRank Cross-Encoder ONNX model locally reranks top-15 candidates to the 5 most semantically precise.',
      tags: ['Qdrant', 'FlashRank', 'Gemini Embeddings'],
    },
    {
      icon: <BarChart3 size={20} className="text-green-400" />,
      title: 'RAGAS Evaluation Suite',
      desc: 'Full automated evaluation pipeline with 6 RAGAS metrics (faithfulness, relevancy, precision, recall, correctness) plus tool-correctness scoring using Jaccard similarity.',
      tags: ['RAGAS', 'DeepEval', '15-sample Dataset'],
    },
    {
      icon: <Search size={20} className="text-orange-400" />,
      title: 'Full Observability',
      desc: 'Distributed traces across every node with Pydantic Logfire spans and LangSmith agent tracing. Every guardrail decision, retrieval call, and LLM response is captured.',
      tags: ['Logfire', 'LangSmith', 'OpenTelemetry'],
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="Core Features"
          title="Every layer engineered for production"
          sub="Not a tutorial project. Each component is chosen for reliability, observability, and enterprise-grade safety."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {features.map((f) => (
            <div key={f.title}
              className="group p-6 rounded-2xl border border-[#2a2a3a] bg-[#0d0d14]
                hover:border-indigo-500/30 hover:bg-[#111118] transition-all duration-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-[#f1f1f5] mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#5a5a72] leading-relaxed mb-4">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-[#1a1a24] border border-[#2a2a3a]
                    text-[10px] font-mono text-[#5a5a72]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pipeline ──────────────────────────────────────────────────────────── */
function PipelineSection() {
  const steps = [
    {
      num: '01', title: 'Safety Gate',
      desc: 'NeMo Guardrails screens every incoming message for off-topic content, jailbreaks, and prompt injections before anything else runs.',
      color: 'border-purple-500/30 bg-purple-500/5', numColor: 'text-purple-400',
      icon: <Lock size={16} className="text-purple-400" />,
    },
    {
      num: '02', title: 'Intent Planning',
      desc: 'The Planner LLM node classifies intent. Conversational queries skip to the Responder using MemorySaver history. Technical queries get a refined search term.',
      color: 'border-indigo-500/30 bg-indigo-500/5', numColor: 'text-indigo-400',
      icon: <GitBranch size={16} className="text-indigo-400" />,
    },
    {
      num: '03', title: 'Vector Retrieval',
      desc: 'The refined query is embedded with Gemini (3072-dim) and searched in Qdrant Cloud. Top-15 candidate chunks are returned via cosine similarity.',
      color: 'border-blue-500/30 bg-blue-500/5', numColor: 'text-blue-400',
      icon: <Database size={16} className="text-blue-400" />,
    },
    {
      num: '04', title: 'Semantic Reranking',
      desc: 'FlashRank\'s ONNX Cross-Encoder rescores all 15 candidates and keeps the 5 most semantically relevant — eliminating lexical noise from the context window.',
      color: 'border-yellow-500/30 bg-yellow-500/5', numColor: 'text-yellow-400',
      icon: <Search size={16} className="text-yellow-400" />,
    },
    {
      num: '05', title: 'LLM Synthesis',
      desc: 'The Responder node builds a structured prompt from the reranked context + conversation history, then routes through Portkey to Groq Llama 3.3 70B.',
      color: 'border-green-500/30 bg-green-500/5', numColor: 'text-green-400',
      icon: <Cpu size={16} className="text-green-400" />,
    },
  ]

  return (
    <section className="py-24 px-6 bg-[#0d0d14] border-y border-[#2a2a3a]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="Agent Pipeline"
          title="How a query flows through the system"
          sub="Five deterministic stages, each independently traceable via Logfire spans and LangSmith."
        />
        <div className="mt-14 space-y-4">
          {steps.map((s, i) => (
            <div key={s.num}
              className={`flex items-start gap-5 p-5 rounded-2xl border transition-all duration-150 ${s.color}`}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-[#0d0d14] border border-[#2a2a3a]`}>
                  {s.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-[#2a2a3a]" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold ${s.numColor}`}>{s.num}</span>
                  <h3 className="text-sm font-semibold text-[#f1f1f5]">{s.title}</h3>
                </div>
                <p className="text-[13px] text-[#5a5a72] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Capabilities ──────────────────────────────────────────────────────── */
function CapabilitiesSection() {
  const items = [
    'Multi-turn conversation memory via LangGraph MemorySaver',
    'Automatic LLM fallback on rate limit or server error',
    'Portkey semantic cache for instant repeated responses',
    'Local document ingestion — PDF, HTML, DOCX, PPTX, TXT',
    'Paragraph-level chunking with 1500-char boundaries',
    'Dual embedding strategy: Gemini primary, sentence-transformers fallback',
    'RAGAS automated evaluation with judge LLM scoring',
    'Full distributed tracing across every pipeline stage',
    'NeMo Guardrails blocks 5 threat categories at the gate',
    'Docker-ready with FastAPI + Uvicorn production server',
    'Qdrant collection wipe + rebuild via single CLI command',
    'FlashRank ONNX runs fully offline — zero network latency',
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge="Capabilities"
          title="What this system can do"
          sub="Built beyond the tutorial — every feature has a production rationale."
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#2a2a3a] bg-[#0d0d14]">
              <CheckCircle size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#8b8ba7] leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-[#2a2a3a]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
          bg-indigo-500/15 border border-indigo-500/25 mb-8">
          <Network size={24} className="text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-[#f1f1f5] mb-4">See it running live</h2>
        <p className="text-[#5a5a72] text-base leading-relaxed mb-10 max-w-lg mx-auto">
          The full pipeline — guardrails, vector search, reranking, and LLM synthesis —
          is live. Ask it anything about Kubernetes, Intel hardware, or networking.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-semibold transition-all duration-150 no-underline
              shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35"
          >
            Open Live Demo
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/architecture"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#2a2a3a]
              hover:border-indigo-500/30 text-[#8b8ba7] hover:text-[#f1f1f5] text-sm font-medium
              transition-all duration-150 no-underline"
          >
            Deep Dive
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function SectionHeader({ badge, title, sub }: { badge: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10
        text-indigo-300 text-[11px] font-mono uppercase tracking-wider mb-4">
        {badge}
      </span>
      <h2 className="text-3xl font-bold text-[#f1f1f5] mb-3">{title}</h2>
      <p className="text-[#5a5a72] text-sm max-w-xl mx-auto leading-relaxed">{sub}</p>
    </div>
  )
}
