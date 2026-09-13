import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cpu, ExternalLink, Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Overview' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/stack', label: 'Tech Stack' },
  { to: '/observability', label: 'Observability' },
  { to: '/chat', label: 'Live Demo' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])
  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-14
        border-b border-[#2a2a3a] bg-[#0a0a0f]/95 backdrop-blur-md">

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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* GitHub — hidden on very small screens */}
          <a
            href="https://github.com/maheshnallada/KubeAegis"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8b8ba7]
              hover:text-[#f1f1f5] hover:bg-[#1a1a24] border border-[#2a2a3a] transition-all duration-150 no-underline"
          >
            <ExternalLink size={13} />
            <span className="hidden md:block">Source</span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[#2a2a3a]
              text-[#8b8ba7] hover:text-[#f1f1f5] hover:bg-[#1a1a24] transition-all duration-150"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer — slides down from top */}
      <div className={`fixed top-14 left-0 right-0 z-40 md:hidden
        border-b border-[#2a2a3a] bg-[#0d0d14]
        transition-all duration-200 ease-out
        ${menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        <div className="px-4 py-3 space-y-1">
          {LINKS.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-150 no-underline
                  ${active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                    : 'text-[#8b8ba7] hover:text-[#f1f1f5] hover:bg-[#1a1a24] border border-transparent'
                  }`}
              >
                {label}
                {to === '/chat' && <ExternalLink size={13} className="opacity-50" />}
              </Link>
            )
          })}
          {/* GitHub in menu */}
          <a
            href="https://github.com/maheshnallada/KubeAegis"
            target="_blank"
            rel="noreferrer"
            className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#5a5a72]
              hover:text-[#f1f1f5] hover:bg-[#1a1a24] border border-transparent transition-all no-underline"
          >
            <ExternalLink size={13} />
            Source code
          </a>
        </div>
      </div>
    </>
  )
}
