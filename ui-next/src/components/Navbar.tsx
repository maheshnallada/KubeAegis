import { Link, useLocation } from 'react-router-dom'
import { Cpu, ExternalLink } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Overview' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/stack', label: 'Tech Stack' },
  { to: '/chat', label: 'Live Demo' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14
      border-b border-[#2a2a3a] bg-[#0a0a0f]/90 backdrop-blur-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
          <Cpu size={14} className="text-indigo-400" />
        </div>
        <span className="text-sm font-semibold text-[#f1f1f5]">KubeAegis</span>
        <span className="hidden sm:block text-[10px] font-mono text-[#5a5a72] uppercase tracking-widest">
          Enterprise RAG
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {LINKS.map(({ to, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 no-underline
                ${active
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                  : 'text-[#8b8ba7] hover:text-[#f1f1f5] hover:bg-[#1a1a24]'
                }
                ${to === '/chat' ? (active ? '' : 'border border-[#2a2a3a]') : ''}`}
            >
              {label}
              {to === '/chat' && !active && (
                <ExternalLink size={10} className="inline ml-1 opacity-50" />
              )}
            </Link>
          )
        })}
      </div>

      {/* GitHub */}
      <a
        href="https://github.com/maheshnallada/KubeAegis"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8b8ba7]
          hover:text-[#f1f1f5] hover:bg-[#1a1a24] border border-[#2a2a3a] transition-all duration-150 no-underline"
      >
        <ExternalLink size={13} />
        <span className="hidden sm:block">Source</span>
      </a>
    </nav>
  )
}
