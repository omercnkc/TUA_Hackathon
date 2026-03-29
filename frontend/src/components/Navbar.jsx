import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

/** Mock’taki gibi: aktif = mor metin + cyan alt çizgi */
function navLinkClass(isActive) {
  if (isActive) {
    return 'border-b-2 border-cyan-400 pb-1 text-sm font-bold text-violet-400 transition-colors duration-300 sm:text-base'
  }
  return 'border-b-2 border-transparent pb-1 text-sm text-zinc-400 transition-colors duration-300 hover:text-slate-100 dark:text-zinc-400 dark:hover:text-slate-100 sm:text-base text-slate-600 hover:text-slate-900'
}

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar({ theme, onToggleTheme }) {
  const { pathname, hash } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const onHome = pathname === '/home'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  const go = (e, id) => {
    e.preventDefault()
    if (onHome) scrollToId(id)
    setOpen(false)
  }

  const shell = scrolled || open ? 'ethereal-glow shadow-[0_8px_40px_rgba(0,0,0,0.35)]' : 'ethereal-glow'

  return (
    <nav
      className={`font-headline fixed top-0 left-0 right-0 z-[998] w-full tracking-tight antialiased transition-all duration-300 ${shell}
        bg-zinc-950/70 backdrop-blur-xl dark:bg-zinc-950/70 dark:backdrop-blur-xl
        bg-white/90 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link
          to="/home"
          className="flex items-center gap-2"
        >
          <img src="/cosmos-logo.png" alt="COSMOS" className="h-8 w-auto object-contain" />
          <span className="cosmos-logo-text text-2xl font-black tracking-tighter">COSMOS</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/home" end className={({ isActive }) => navLinkClass(isActive)}>
            Anasayfa
          </NavLink>
          {onHome ? (
            <a href="#analiz" className={navLinkClass(false)} onClick={(e) => go(e, 'analiz')}>
              Analiz
            </a>
          ) : (
            <Link to="/home#analiz" className={navLinkClass(false)}>
              Analiz
            </Link>
          )}
          <NavLink to="/compare" className={({ isActive }) => navLinkClass(isActive)}>
            Karşılaştır
          </NavLink>
          {onHome ? (
            <a href="#hakkimizda" className={navLinkClass(false)} onClick={(e) => go(e, 'hakkimizda')}>
              Hakkımızda
            </a>
          ) : (
            <Link to="/home#hakkimizda" className={navLinkClass(false)}>
              Hakkımızda
            </Link>
          )}
          {onHome ? (
            <a href="#iletisim" className={navLinkClass(false)} onClick={(e) => go(e, 'iletisim')}>
              İletişim
            </a>
          ) : (
            <Link to="/home#iletisim" className={navLinkClass(false)}>
              İletişim
            </Link>
          )}
          {onHome ? (
            <a href="#gecmis" className={navLinkClass(false)} onClick={(e) => go(e, 'gecmis')}>
              Geçmiş Denemeler
            </a>
          ) : (
            <Link to="/home#gecmis" className={navLinkClass(false)}>
              Geçmiş Denemeler
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 pl-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="text-violet-400 transition-transform hover:scale-105 md:hidden"
            aria-expanded={open}
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-black/5 px-4 py-4 dark:border-white/10 md:hidden">
          <NavLink to="/home" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            Anasayfa
          </NavLink>
          <Link to="/home#analiz" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            Analiz
          </Link>
          <NavLink to="/compare" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            Karşılaştır
          </NavLink>
          <Link to="/home#hakkimizda" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            Hakkımızda
          </Link>
          <Link to="/home#iletisim" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            İletişim
          </Link>
          <Link to="/home#gecmis" className="py-2 text-slate-800 dark:text-zinc-200" onClick={() => setOpen(false)}>
            Geçmiş Denemeler
          </Link>
        </div>
      )}
    </nav>
  )
}
