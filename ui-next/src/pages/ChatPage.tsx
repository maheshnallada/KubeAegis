import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uid } from 'uuid'
import Sidebar from '../components/Sidebar'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { queryRAGStream, checkHealth } from '../api'
import type { Message, Session } from '../types'

const STORAGE_KEY = 'kubeaegis-sessions'
const MESSAGES_KEY = 'kubeaegis-messages'

function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
  catch { return [] }
}
function saveSessions(s: Session[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }
function loadMessages(id: string): Message[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`${MESSAGES_KEY}-${id}`) ?? '[]')
    return raw.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
  } catch { return [] }
}
function saveMessages(id: string, msgs: Message[]) {
  localStorage.setItem(`${MESSAGES_KEY}-${id}`, JSON.stringify(msgs))
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const [activeId, setActiveId] = useState<string>(() => loadSessions()[0]?.id ?? uid())
  const [messages, setMessages] = useState<Message[]>(() => loadMessages(activeId))
  const [loading, setLoading] = useState(false)
  const [backendOnline, setBackendOnline] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    checkHealth().then(setBackendOnline)
    const t = setInterval(() => checkHealth().then(setBackendOnline), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { saveSessions(sessions) }, [sessions])
  useEffect(() => { saveMessages(activeId, messages) }, [messages, activeId])

  const switchSession = useCallback((id: string) => {
    setActiveId(id); setMessages(loadMessages(id)); setLoading(false)
  }, [])

  const newSession = useCallback(() => {
    const id = uid()
    setSessions((p) => [{ id, label: `Conversation ${p.length + 1}`, createdAt: new Date(), messageCount: 0, preview: '' }, ...p])
    switchSession(id)
  }, [sessions.length, switchSession])

  const deleteSession = useCallback((id: string) => {
    setSessions((p) => p.filter((s) => s.id !== id))
    localStorage.removeItem(`${MESSAGES_KEY}-${id}`)
    if (id === activeId) {
      const rem = sessions.filter((s) => s.id !== id)
      if (rem.length) switchSession(rem[0].id); else newSession()
    }
  }, [activeId, sessions, switchSession, newSession])

  useEffect(() => {
    if (!sessions.find((s) => s.id === activeId)) {
      setSessions((p) => [{ id: activeId, label: 'New conversation', createdAt: new Date(), messageCount: 0, preview: '' }, ...p])
    }
  }, [activeId, sessions])

  const handleSend = async (content: string) => {
    // Cancel any in-flight stream
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: Message = { id: uid(), role: 'user', content, timestamp: new Date() }
    const assistantId = uid()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), isLoading: true }

    setMessages((p) => [...p, userMsg, assistantMsg])
    setLoading(true)

    setSessions((p) => p.map((s) =>
      s.id === activeId
        ? { ...s, preview: content.slice(0, 50), messageCount: s.messageCount + 1, label: s.messageCount === 0 ? content.slice(0, 32) || s.label : s.label }
        : s
    ))

    try {
      await queryRAGStream(content, activeId, {
        onToken: (token) => {
          setMessages((p) => p.map((m) =>
            m.id === assistantId
              ? { ...m, isLoading: false, content: m.content + token }
              : m
          ))
        },
        onMetadata: (meta) => {
          setMessages((p) => p.map((m) =>
            m.id === assistantId
              ? { ...m, isLoading: false, thoughtProcess: meta.thought_process, sources: meta.sources, status: meta.status, isBlocked: meta.is_blocked }
              : m
          ))
        },
        onError: (err) => {
          setMessages((p) => p.map((m) =>
            m.id === assistantId
              ? { ...m, isLoading: false, content: `**Error:** ${err}` }
              : m
          ))
        },
      }, controller.signal)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages((p) => p.map((m) =>
        m.id === assistantId
          ? { ...m, isLoading: false, content: '**Backend unreachable.** Make sure the FastAPI server is running on port 8000.' }
          : m
      ))
    } finally {
      setLoading(false)
    }
  }

  const activeLabel = sessions.find((s) => s.id === activeId)?.label ?? 'New conversation'

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeId}
        onNewSession={newSession}
        onSelectSession={switchSession}
        onDeleteSession={deleteSession}
        backendOnline={backendOnline}
      />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#2a2a3a] bg-[#0a0a0f] shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-[#f1f1f5]">{activeLabel}</h1>
            <p className="text-[11px] text-[#5a5a72] mt-0.5">Kubernetes · Intel · Networking</p>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border
            ${backendOnline ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {backendOnline ? 'API Online' : 'API Offline'}
          </span>
        </header>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0
            ? <EmptyState onSuggestion={handleSend} />
            : (
              <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
                {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
                <div ref={bottomRef} />
              </div>
            )
          }
        </div>
        <ChatInput onSend={handleSend} loading={loading} disabled={!backendOnline && messages.length === 0} />
      </div>
    </div>
  )
}

function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const cards = [
    { title: 'Kubernetes', desc: 'Pod scheduling, resource limits, networking policies', q: 'Explain Kubernetes Pod scheduling strategies' },
    { title: 'Intel Hardware', desc: 'AMX, SGX, hardware acceleration, platform features', q: 'What is Intel AMX and how does it accelerate AI workloads?' },
    { title: 'Networking', desc: 'BGP, CNI plugins, service mesh, load balancing', q: 'How does BGP routing work in Kubernetes clusters?' },
    { title: 'Enterprise Ops', desc: 'Security, observability, multi-tenancy, RBAC', q: 'What are best practices for Kubernetes RBAC?' },
  ]
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-indigo-400">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#f1f1f5] mb-2">KubeAegis RAG</h2>
      <p className="text-sm text-[#5a5a72] text-center max-w-sm mb-10">
        Enterprise knowledge base for Kubernetes, Intel hardware, and networking.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
        {cards.map((c) => (
          <button key={c.title} onClick={() => onSuggestion(c.q)}
            className="text-left px-4 py-3.5 rounded-xl border border-[#2a2a3a] bg-[#111118]
              hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer group">
            <p className="text-sm font-medium text-[#f1f1f5] group-hover:text-indigo-300 transition-colors">{c.title}</p>
            <p className="text-[11px] text-[#5a5a72] mt-1 leading-relaxed">{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
