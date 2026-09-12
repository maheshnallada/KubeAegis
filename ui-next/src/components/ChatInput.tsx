import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'

interface Props {
  onSend: (msg: string) => void
  disabled?: boolean
  loading?: boolean
}

const SUGGESTIONS = [
  'What is Kubernetes Pod scheduling?',
  'Explain Intel AMX acceleration',
  'How does BGP routing work?',
  'What are Kubernetes resource limits?',
]

export default function ChatInput({ onSend, disabled, loading }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || loading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="px-4 py-4 border-t border-[#2a2a3a] bg-[#0a0a0f]">
      {/* Suggestions (only when empty) */}
      {!value && !loading && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className="px-2.5 py-1 rounded-full text-[11px] text-[#5a5a72] border border-[#2a2a3a]
                hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/5
                transition-all duration-150 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={`flex items-end gap-3 rounded-xl border px-4 py-3 transition-colors duration-150
        ${disabled ? 'border-[#2a2a3a] opacity-50' : 'border-[#2a2a3a] focus-within:border-indigo-500/50 bg-[#111118]'}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled || loading}
          placeholder="Ask about Kubernetes, Intel hardware, networking…"
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#f1f1f5] placeholder-[#5a5a72]
            resize-none outline-none leading-relaxed min-h-[24px]"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled || loading}
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer
            ${value.trim() && !disabled && !loading
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-[#2a2a3a] text-[#5a5a72] cursor-not-allowed'}`}
        >
          {loading ? <Square size={13} /> : <Send size={13} />}
        </button>
      </div>

      <p className="text-center text-[10px] text-[#3a3a4a] mt-2">
        KubeAegis · Enterprise RAG · Powered by Groq + Qdrant
      </p>
    </div>
  )
}
