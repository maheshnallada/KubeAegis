import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Cpu, User, Shield } from 'lucide-react'
import type { Message } from '../types'
import ThoughtProcess from './ThoughtProcess'
import SourcesDrawer from './SourcesDrawer'

interface Props {
  message: Message
}

// True while content is accumulating but metadata hasn't arrived yet
function isStreaming(message: Message) {
  return !message.isLoading && message.content.length > 0 && !message.thoughtProcess
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 group">
        <div className="max-w-[75%]">
          <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-indigo-600 text-white text-sm leading-relaxed">
            {message.content}
          </div>
          <p className="text-[10px] text-[#5a5a72] text-right mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2a2a3a] shrink-0 mt-0.5">
          <User size={13} className="text-[#8b8ba7]" />
        </div>
      </div>
    )
  }

  const streaming = isStreaming(message)

  return (
    <div className="flex items-start gap-3 group">
      <div className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5 border
        ${streaming
          ? 'bg-indigo-500/30 border-indigo-400/50 animate-pulse'
          : 'bg-indigo-500/20 border-indigo-500/30'}`}>
        {message.isBlocked
          ? <Shield size={13} className="text-indigo-400" />
          : <Cpu size={13} className="text-indigo-400" />
        }
      </div>

      <div className="flex-1 min-w-0">
        {/* Thinking — before first token */}
        {message.isLoading && message.content === '' ? (
          <div className="flex items-center gap-2 py-3">
            <span className="text-sm text-[#5a5a72]">Thinking</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </div>
        ) : (
          <>
            {message.isBlocked && (
              <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 w-fit">
                <Shield size={10} className="text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">Guardrail fired</span>
              </div>
            )}

            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] text-sm text-[#e2e2ee]">
              <div className="prose-chat">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                {/* Blinking cursor while streaming */}
                {streaming && (
                  <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
                )}
              </div>
            </div>

            {!streaming && (
              <p className="text-[10px] text-[#5a5a72] mt-1">
                {formatTime(message.timestamp)}
              </p>
            )}

            <ThoughtProcess steps={message.thoughtProcess ?? []} />
            <SourcesDrawer sources={message.sources ?? []} />
          </>
        )}
      </div>
    </div>
  )
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(d)
}
