import { Plus, Trash2, MessageSquare, Shield, Cpu, Zap, ChevronRight } from 'lucide-react'
import type { Session } from '../types'

interface Props {
  sessions: Session[]
  activeSessionId: string
  onNewSession: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  backendOnline: boolean
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  backendOnline,
}: Props) {
  return (
    <aside className="flex flex-col w-64 shrink-0 h-full border-r border-[#2a2a3a] bg-[#0d0d14]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#2a2a3a]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
          <Cpu size={16} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f1f1f5] leading-none">KubeAegis</p>
          <p className="text-[10px] text-[#5a5a72] mt-0.5 font-mono uppercase tracking-wider">RAG · v1.0</p>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
            bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40
            text-indigo-300 hover:text-indigo-200 transition-all duration-150 cursor-pointer"
        >
          <Plus size={15} />
          New conversation
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-2 space-y-1">
        {sessions.length === 0 ? (
          <p className="text-xs text-[#5a5a72] px-2 py-4 text-center">No conversations yet</p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                s.id === activeSessionId
                  ? 'bg-indigo-500/15 border border-indigo-500/25 text-[#f1f1f5]'
                  : 'hover:bg-[#1a1a24] border border-transparent text-[#8b8ba7] hover:text-[#f1f1f5]'
              }`}
            >
              <MessageSquare size={13} className="shrink-0 opacity-60" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{s.label}</p>
                {s.preview && (
                  <p className="text-[10px] text-[#5a5a72] truncate mt-0.5">{s.preview}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id) }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-[#5a5a72] hover:text-[#ef4444] transition-all cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Status Footer */}
      <div className="px-4 py-4 border-t border-[#2a2a3a] space-y-2.5">
        <StatusRow
          icon={<Zap size={11} />}
          label="Backend API"
          value={backendOnline ? 'Online' : 'Offline'}
          color={backendOnline ? 'text-green-400' : 'text-red-400'}
          dot={backendOnline ? 'bg-green-400' : 'bg-red-400'}
        />
        <StatusRow
          icon={<Shield size={11} />}
          label="Guardrails"
          value="Active"
          color="text-indigo-400"
          dot="bg-indigo-400"
        />
        <StatusRow
          icon={<ChevronRight size={11} />}
          label="LLM"
          value="Groq · Llama 3.3"
          color="text-[#8b8ba7]"
          dot="bg-[#8b8ba7]"
        />
      </div>
    </aside>
  )
}

function StatusRow({ icon, label, value, color, dot }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  dot: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-[#5a5a72]">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dot} opacity-80`} />
        <span className={`text-[10px] font-medium ${color}`}>{value}</span>
      </div>
    </div>
  )
}
