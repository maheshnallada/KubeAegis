import { useState } from 'react'
import { ChevronDown, ChevronUp, GitBranch, Zap, Shield, Search, MessageSquare, CheckCircle } from 'lucide-react'

interface Props {
  steps: string[]
  isLoading?: boolean
}

function getStepIcon(step: string) {
  const s = step.toLowerCase()
  if (s.includes('cache')) return <Zap size={11} className="text-yellow-400" />
  if (s.includes('guardrail') || s.includes('shield')) return <Shield size={11} className="text-indigo-400" />
  if (s.includes('retriev') || s.includes('search') || s.includes('context')) return <Search size={11} className="text-blue-400" />
  if (s.includes('convers') || s.includes('memory')) return <MessageSquare size={11} className="text-purple-400" />
  if (s.includes('start') || s.includes('intent')) return <GitBranch size={11} className="text-green-400" />
  return <CheckCircle size={11} className="text-[#5a5a72]" />
}

export default function ThoughtProcess({ steps, isLoading }: Props) {
  const [open, setOpen] = useState(false)

  if (!steps?.length && !isLoading) return null

  return (
    <div className="mt-3 rounded-lg border border-[#2a2a3a] bg-[#0d0d14] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer
          hover:bg-[#1a1a24] transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <GitBranch size={12} className="text-indigo-400" />
          <span className="text-[11px] font-mono text-[#8b8ba7] uppercase tracking-wider">
            Thought process
          </span>
          {isLoading && (
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={12} className="text-[#5a5a72]" /> : <ChevronDown size={12} className="text-[#5a5a72]" />}
      </button>

      {open && (
        <div className="border-t border-[#2a2a3a] px-3 py-2.5 space-y-1.5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-mono text-[#5a5a72] w-4 text-right">{i + 1}.</span>
                {getStepIcon(step)}
              </div>
              <span className="text-[11px] text-[#8b8ba7] font-mono leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
