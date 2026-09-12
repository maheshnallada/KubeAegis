import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface Props {
  sources: string[]
}

export default function SourcesDrawer({ sources }: Props) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!sources?.length) return null

  return (
    <div className="mt-2 rounded-lg border border-[#2a2a3a] bg-[#0d0d14] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer
          hover:bg-[#1a1a24] transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-blue-400" />
          <span className="text-[11px] font-mono text-[#8b8ba7] uppercase tracking-wider">
            {sources.length} source chunk{sources.length !== 1 ? 's' : ''} retrieved
          </span>
        </div>
        {open ? <ChevronUp size={12} className="text-[#5a5a72]" /> : <ChevronDown size={12} className="text-[#5a5a72]" />}
      </button>

      {open && (
        <div className="border-t border-[#2a2a3a] divide-y divide-[#2a2a3a]">
          {sources.map((src, i) => {
            const isOpen = expanded === i
            const preview = src.replace('CONTENT: ', '').slice(0, 90).replace(/\n/g, ' ')
            return (
              <div key={i}>
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer
                    hover:bg-[#1a1a24] transition-colors duration-150"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ExternalLink size={10} className="text-[#5a5a72] shrink-0" />
                    <span className="text-[11px] text-[#5a5a72] truncate">
                      Chunk {i + 1}: {preview}…
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronUp size={10} className="text-[#5a5a72] shrink-0" />
                    : <ChevronDown size={10} className="text-[#5a5a72] shrink-0" />
                  }
                </button>
                {isOpen && (
                  <div className="px-3 pb-3">
                    <div className="rounded-md bg-[#111118] border border-[#2a2a3a] p-3
                      text-[11px] text-[#8b8ba7] font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {src.replace('CONTENT: ', '')}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
