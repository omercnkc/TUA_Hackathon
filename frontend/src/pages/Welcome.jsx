import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Platform } from '../components/Platform'
import { Rocket } from '../components/Rocket'
import { useAuth } from '../hooks/useAuth'

/* ─────────────────────────────────────────
   Starfield canvas (lightweight, no pink)
───────────────────────────────────────── */
function Starfield() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const rnd = (a, b) => Math.random() * (b - a) + a
    const stars = Array.from({ length: 280 }, () => ({
      x: rnd(0, canvas.width), y: rnd(0, canvas.height),
      r: rnd(0.2, 1.8),
      tw: rnd(0, Math.PI * 2), twS: rnd(0.008, 0.04),
      col: Math.random() > 0.85 ? (Math.random() > 0.5 ? '0,207,252' : '187,158,255') : '255,255,255',
    }))

    // Shooting stars
    const shots = []
    const spawnShot = () => shots.push({
      x: rnd(0, canvas.width), y: rnd(0, canvas.height * 0.5),
      vx: rnd(12, 22), vy: rnd(3, 8),
      len: rnd(100, 200), alpha: 1, col: '0,207,252',
    })
    const si = setInterval(() => { spawnShot(); if (Math.random() > 0.5) setTimeout(spawnShot, 300) }, 1600)

    let t = 0
    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      t += 0.016

      // Nebula glows — only cyan + purple (no pink)
      const nebulae = [
        { x: 0.12, y: 0.2,  r: 260, col: '0,100,180',    a: 0.07 },
        { x: 0.88, y: 0.75, r: 220, col: '80,40,160',    a: 0.07 },
        { x: 0.5,  y: 0.9,  r: 180, col: '0,80,140',     a: 0.05 },
        { x: 0.7,  y: 0.15, r: 160, col: '60,30,120',    a: 0.04 },
      ]
      nebulae.forEach((n) => {
        const pulse = 1 + 0.05 * Math.sin(t * 0.35 + n.x * 8)
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, n.r * pulse)
        g.addColorStop(0, `rgba(${n.col},${n.a})`)
        g.addColorStop(1, `rgba(${n.col},0)`)
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, n.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      })

      // Stars
      stars.forEach((s) => {
        s.tw += s.twS
        const a = 0.2 + 0.8 * ((Math.sin(s.tw) + 1) / 2)
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.col},${a})`; ctx.fill()
      })

      // Shooting stars
      for (let i = shots.length - 1; i >= 0; i--) {
        const sh = shots[i]
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8)
        g.addColorStop(0, `rgba(${sh.col},${sh.alpha})`)
        g.addColorStop(1, `rgba(${sh.col},0)`)
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(sh.x - Math.cos(Math.atan2(sh.vy, sh.vx)) * sh.len,
                   sh.y - Math.sin(Math.atan2(sh.vy, sh.vx)) * sh.len)
        ctx.strokeStyle = g; ctx.lineWidth = 1.5
        ctx.shadowBlur = 6; ctx.shadowColor = `rgba(${sh.col},0.8)`
        ctx.stroke(); ctx.shadowBlur = 0
        sh.x += sh.vx; sh.y += sh.vy; sh.alpha -= 0.016
        if (sh.alpha <= 0) shots.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); clearInterval(si); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
}

/* ─────────────────────────────────────────
   Launch sequence state machine
   Phase: idle → shaking[0] → launching[0] → shaking[1] → launching[1] → shaking[2] → launching[2] → done
───────────────────────────────────────── */
const ROCKETS = [
  { color: 'cyan',   label: 'COSMOS-1' },
  { color: 'purple', label: 'COSMOS-2' },
  { color: 'pink',   label: 'COSMOS-3' },
]

const SHAKE_DURATION   = 400   // ms vibration before launch
const LAUNCH_DURATION  = 1200  // ms flight animation
const GAP_BETWEEN      = 200   // ms pause between rockets

export function Welcome() {
  const navigate = useNavigate()
  const { login, register, loading: authLoading, error: authError, setError } = useAuth()

  // Login / Register form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (isRegister) {
      const user = await register(email, password)
      if (user) {
        navigate('/home')
      }
      // authError will be set by register() if it failed — user sees the message
    } else {
      const user = await login(email, password)
      if (user) navigate('/home')
    }
  }

  // If registration failed because email already exists, offer to switch to login
  const emailAlreadyInUse = authError === 'Bu e-posta zaten kullanımda.'

  // per-rocket state: 'idle' | 'shaking' | 'launching' | 'gone'
  const [rocketStates, setRocketStates] = useState(['idle', 'idle', 'idle'])
  const [platformShake, setPlatformShake] = useState(false)
  const [flashIndex, setFlashIndex] = useState(null)
  const [allGone, setAllGone] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  // Countdown display
  const [countdown, setCountdown] = useState(null)

  const setRocketState = (i, state) =>
    setRocketStates((prev) => prev.map((s, idx) => (idx === i ? state : s)))

  const launchRocket = (i) => {
    // Show index in countdown display
    setCountdown(i + 1)
    setTimeout(() => setCountdown(null), 600)

    // Shake → launch → gone, each rocket ~1s total
    setRocketState(i, 'shaking')
    setPlatformShake(true)
    setTimeout(() => setPlatformShake(false), 300)

    setTimeout(() => {
      setFlashIndex(i)
      setTimeout(() => setFlashIndex(null), 500)
      setRocketState(i, 'launching')

      setTimeout(() => {
        setRocketState(i, 'gone')
        if (i < ROCKETS.length - 1) {
          setTimeout(() => launchRocket(i + 1), GAP_BETWEEN)
        } else {
          // All launched — show "in orbit", then reset and loop
          setAllGone(true)
          setShowBtn(true)
          setTimeout(() => {
            setAllGone(false)
            setRocketStates(['idle', 'idle', 'idle'])
            setTimeout(() => launchRocket(0), 400)
          }, 2000)
        }
      }, LAUNCH_DURATION)
    }, SHAKE_DURATION)
  }

  useEffect(() => {
    const t = setTimeout(() => launchRocket(0), 600)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-body"
         style={{ background: 'linear-gradient(160deg, #030308 0%, #0a0616 40%, #060d1a 70%, #030308 100%)' }}>

      {/* Starfield */}
      <Starfield />

      {/* Ambient orbs — no pink, only deep blue/purple */}
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
        <div className="absolute left-[-15%] top-[-15%] h-[55%] w-[55%] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(60,20,140,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute right-[-15%] bottom-[-15%] h-[50%] w-[50%] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(0,80,160,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute left-[30%] top-[60%] h-[35%] w-[35%] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(40,10,100,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Launch flash overlay */}
      {flashIndex !== null && (
        <div
          className="launch-flash pointer-events-none fixed inset-0 z-[20]"
          style={{
            background: flashIndex === 0
              ? 'radial-gradient(circle at 35% 55%, rgba(0,207,252,0.25) 0%, transparent 60%)'
              : flashIndex === 1
              ? 'radial-gradient(circle at 50% 55%, rgba(187,158,255,0.25) 0%, transparent 60%)'
              : 'radial-gradient(circle at 65% 55%, rgba(255,89,227,0.15) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Main content — two column layout */}
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* ── LEFT: Launch scene ── */}
          <div className="flex flex-1 flex-col items-center">
            {/* Header */}
            <div className="mb-8 flex flex-col items-center gap-3">
              <img src="/cosmos-logo.png" alt="COSMOS" className="animate-float h-16 w-auto object-contain"
                   style={{ filter: 'drop-shadow(0 0 20px rgba(0,207,252,0.4))' }} />
              <h1 className="cosmos-logo-text font-headline text-4xl font-black tracking-tighter md:text-5xl">
                COSMOS
              </h1>
              <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
                Aerospatial &amp; Software Engineering
              </p>
            </div>

            {/* Countdown */}
            <div className="mb-6 flex h-10 items-center justify-center">
              {countdown !== null ? (
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 rounded-full" style={{ background: 'rgba(0,207,252,0.3)' }} />
                  <span
                    className="font-headline text-3xl font-black tabular-nums"
                    style={{
                      color: countdown === 1 ? '#ff4444' : countdown === 2 ? '#ffaa00' : '#00cffc',
                      textShadow: `0 0 20px ${countdown === 1 ? 'rgba(255,68,68,0.8)' : countdown === 2 ? 'rgba(255,170,0,0.8)' : 'rgba(0,207,252,0.8)'}`,
                      animation: 'countdown-pulse 0.4s ease-in-out infinite',
                    }}
                  >
                    T-{countdown}
                  </span>
                  <div className="h-1 w-8 rounded-full" style={{ background: 'rgba(0,207,252,0.3)' }} />
                </div>
              ) : !allGone ? (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
                  <span className="tracking-widest uppercase">Launch sequence active</span>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" style={{ animationDelay: '0.5s' }} />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
                  <span className="tracking-widest uppercase text-green-500/70">All systems in orbit</span>
                </div>
              )}
            </div>

            {/* Platform + Rockets */}
            <Platform shake={platformShake}>
              {ROCKETS.map((rocket, i) => (
                <Rocket
                  key={rocket.color}
                  color={rocket.color}
                  label={rocket.label}
                  launchDelay={0}
                  isShaking={rocketStates[i] === 'shaking'}
                  isLaunching={rocketStates[i] === 'launching'}
                  onLaunched={() => {}}
                />
              ))}
            </Platform>

            {/* Status bar */}
            <div className="mt-6 flex items-center gap-6">
              {ROCKETS.map((rocket, i) => {
                const state = rocketStates[i]
                const colMap = { cyan: '#00cffc', purple: '#bb9eff', pink: '#ff59e3' }
                const col = colMap[rocket.color]
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full transition-all duration-300"
                      style={{
                        background: state === 'idle' ? 'rgba(255,255,255,0.15)'
                          : state === 'shaking'   ? col
                          : state === 'launching' ? col
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: (state === 'shaking' || state === 'launching') ? `0 0 8px ${col}, 0 0 16px ${col}` : 'none',
                        animation: state === 'shaking' ? 'countdown-pulse 0.3s ease-in-out infinite' : 'none',
                      }}
                    />
                    <span className="text-[8px] uppercase tracking-widest"
                          style={{ color: state === 'gone' ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.35)' }}>
                      {state === 'gone' ? '✓ orbit' : state === 'launching' ? 'launch' : state === 'shaking' ? 'ignite' : 'standby'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Vertical divider (desktop only) ── */}
          <div className="hidden lg:block"
               style={{ width: 1, alignSelf: 'stretch', background: 'linear-gradient(to bottom, transparent, rgba(0,207,252,0.2), rgba(187,158,255,0.2), transparent)' }} />

          {/* ── RIGHT: Login form ── */}
          <div className="w-full max-w-sm flex-shrink-0 lg:max-w-md">
            <div
              className="rounded-[2rem] p-8 md:p-10"
              style={{
                background: 'rgba(10,8,24,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 0 0 1px rgba(0,207,252,0.08), 0 32px 64px rgba(0,0,0,0.6)',
              }}
            >
              <header className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-3xl font-bold tracking-tight text-white">
                  {isRegister ? 'Hesap Oluştur' : 'Hoşgeldiniz'}
                </h2>
                <p className="text-sm text-zinc-500">
                  {isRegister ? 'Yeni bir hesap oluşturun' : 'Akıllı Analiz Platformuna Giriş Yapın'}
                </p>
                <div className="mx-auto mt-4 h-px w-16 rounded-full"
                     style={{ background: 'linear-gradient(90deg, transparent, rgba(0,207,252,0.6), transparent)' }} />
              </header>

              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Email */}
                <div className="space-y-2">
                  <label className="ml-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    E-posta
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-zinc-600 transition-colors group-focus-within:text-cyan-400">mail</span>
                    </div>
                    <input
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null) }}
                      className="w-full rounded-2xl border-none py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-700 focus:ring-2 focus:ring-cyan-500/40"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      placeholder="kullanici@cosmos.example"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="ml-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Şifre
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-zinc-600 transition-colors group-focus-within:text-cyan-400">lock</span>
                    </div>
                    <input
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null) }}
                      className="w-full rounded-2xl border-none py-4 pl-12 pr-12 text-white outline-none transition-all placeholder:text-zinc-700 focus:ring-2 focus:ring-cyan-500/40"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      placeholder={isRegister ? 'En az 6 karakter' : '••••••••'}
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-600 hover:text-cyan-400 transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {authError && (
                  <div className="rounded-xl px-4 py-3 space-y-2"
                       style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                      <p className="text-sm text-red-400">{authError}</p>
                    </div>
                    {emailAlreadyInUse && (
                      <button
                        type="button"
                        onClick={() => { setIsRegister(false); setError(null) }}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                      >
                        → Giriş yapmak için tıklayın
                      </button>
                    )}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={authLoading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  className="relative mt-2 w-full overflow-hidden rounded-2xl py-4 font-headline font-bold text-black transition-transform duration-300 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #00cffc 0%, #874cff 100%)',
                    transform: btnHover && !authLoading ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: btnHover
                      ? '0 0 32px rgba(0,207,252,0.5), 0 0 64px rgba(187,158,255,0.3)'
                      : '0 0 16px rgba(0,207,252,0.25)',
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                      transform: btnHover ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {authLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Bekleniyor...
                      </>
                    ) : (
                      <>
                        {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 border-t pt-6 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-sm text-zinc-600">
                  {isRegister ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister((v) => !v); setError(null) }}
                    className="font-bold text-violet-400 transition-colors hover:text-violet-300 hover:underline"
                  >
                    {isRegister ? 'Giriş Yapın' : 'Kayıt Olun'}
                  </button>
                </p>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-6 flex flex-wrap justify-center gap-5">
              {['Destek', 'Güvenlik', 'Gizlilik'].map((l) => (
                <a key={l} className="text-[10px] uppercase tracking-widest text-zinc-600 transition-colors hover:text-cyan-500" href="#">{l}</a>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
