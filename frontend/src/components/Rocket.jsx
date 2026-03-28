import { useEffect, useRef, useState } from 'react'

/* Smoke particle that appears on launch */
function SmokeParticle({ delay }) {
  const left = 40 + Math.random() * 20
  const size = 12 + Math.random() * 20
  return (
    <div
      className="smoke-particle pointer-events-none absolute rounded-full"
      style={{
        bottom: '-10px',
        left: `${left}%`,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(180,180,200,0.6) 0%, rgba(100,100,120,0) 70%)',
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export function Rocket({ color, label, launchDelay, onLaunched, isShaking, isLaunching }) {
  const [showFlame, setShowFlame] = useState(false)
  const [smokeParticles, setSmokeParticles] = useState([])
  const smokeTimerRef = useRef(null)

  // Accent colors per rocket
  const accents = {
    cyan:   { body: ['#e8f4ff','#b0cce8','#6a9abf'], nozzle: '#4a7a9b', flame: ['#00cffc','#0080ff','#ffffff'], flameInner: '#ffffff', glow: 'rgba(0,207,252,0.8)' },
    purple: { body: ['#f0e8ff','#c0a0e8','#8060b8'], nozzle: '#6040a0', flame: ['#bb9eff','#8040ff','#ffffff'], flameInner: '#ffffff', glow: 'rgba(187,158,255,0.8)' },
    pink:   { body: ['#ffe8f8','#e8a0c8','#b86090'], nozzle: '#903060', flame: ['#ff59e3','#ff0080','#ffffff'], flameInner: '#ffffff', glow: 'rgba(255,89,227,0.8)' },
  }
  const c = accents[color] || accents.cyan

  useEffect(() => {
    if (!isShaking) return
    // Spawn smoke particles during shake
    const spawn = () => {
      setSmokeParticles((p) => [...p, { id: Date.now() + Math.random(), delay: Math.random() * 0.3 }])
    }
    smokeTimerRef.current = setInterval(spawn, 120)
    return () => clearInterval(smokeTimerRef.current)
  }, [isShaking])

  useEffect(() => {
    if (isShaking || isLaunching) setShowFlame(true)
    else setShowFlame(false)
  }, [isShaking, isLaunching])

  useEffect(() => {
    if (!isLaunching) return
    clearInterval(smokeTimerRef.current)
    const t = setTimeout(() => { onLaunched?.() }, 1900)
    return () => clearTimeout(t)
  }, [isLaunching, onLaunched])

  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: 80 }}>
      {/* Label */}
      <div
        className="mb-3 rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          borderColor: c.glow,
          color: c.flame[0],
          background: `rgba(0,0,0,0.4)`,
          boxShadow: (isShaking || isLaunching) ? `0 0 12px ${c.glow}` : 'none',
          animation: (isShaking || isLaunching) ? `countdown-pulse 0.4s ease-in-out infinite` : 'none',
        }}
      >
        {label}
      </div>

      {/* Rocket + flame wrapper */}
      <div
        className="relative flex flex-col items-center"
        style={{
          animation: isLaunching
            ? 'rocket-launch 1.8s cubic-bezier(0.4,0,0.2,1) forwards'
            : isShaking
            ? 'rocket-shake 0.12s ease-in-out infinite'
            : 'none',
        }}
      >
        {/* Rocket SVG */}
        <svg width="60" height="130" viewBox="0 0 60 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Nose cone */}
          <path d="M30 2 C22 18 16 30 16 48 L44 48 C44 30 38 18 30 2Z" fill={`url(#body_${color})`}/>
          {/* Window */}
          <circle cx="30" cy="34" r="8" fill={`url(#win_${color})`} stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
          <circle cx="27" cy="31" r="2.5" fill="rgba(255,255,255,0.6)"/>
          {/* Body */}
          <rect x="16" y="48" width="28" height="52" fill={`url(#body_${color})`}/>
          {/* Body stripe */}
          <rect x="16" y="68" width="28" height="6" fill={`rgba(255,255,255,0.12)`}/>
          <rect x="16" y="80" width="28" height="4" fill={`rgba(255,255,255,0.08)`}/>
          {/* Side fins */}
          <path d="M16 80 L6 108 L16 100Z" fill={c.body[1]}/>
          <path d="M44 80 L54 108 L44 100Z" fill={c.body[1]}/>
          {/* Nozzle */}
          <path d="M20 100 L14 116 L46 116 L40 100Z" fill={c.nozzle}/>
          <ellipse cx="30" cy="116" rx="16" ry="4" fill={c.nozzle} opacity="0.7"/>

          {/* Exhaust ring on nozzle */}
          <ellipse cx="30" cy="116" rx="14" ry="3"
            fill={showFlame ? c.flame[0] : 'none'}
            opacity={showFlame ? 0.8 : 0}
            style={{ animation: showFlame ? 'exhaust-glow 0.1s ease-in-out infinite' : 'none' }}
          />

          <defs>
            <linearGradient id={`body_${color}`} x1="16" y1="0" x2="44" y2="130" gradientUnits="userSpaceOnUse">
              <stop stopColor={c.body[0]}/>
              <stop offset="0.5" stopColor={c.body[1]}/>
              <stop offset="1" stopColor={c.body[2]}/>
            </linearGradient>
            <radialGradient id={`win_${color}`} cx="40%" cy="35%" r="60%">
              <stop stopColor={c.flame[0]} stopOpacity="0.9"/>
              <stop offset="0.6" stopColor={c.flame[1]} stopOpacity="0.7"/>
              <stop offset="1" stopColor="rgba(0,0,0,0.5)"/>
            </radialGradient>
          </defs>
        </svg>

        {/* Flame */}
        {showFlame && (
          <div className="absolute pointer-events-none" style={{ bottom: -2, left: '50%', transform: 'translateX(-50%)' }}>
            {/* Outer flame */}
            <div
              className="flame-flicker relative"
              style={{
                width: 28,
                height: 55 + (isLaunching ? 30 : 0),
                background: `linear-gradient(to bottom, ${c.flame[0]}, ${c.flame[1]}, rgba(255,100,0,0.6), transparent)`,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 85% 60%, 70% 80%, 50% 100%, 30% 80%, 15% 60%, 0% 30%)',
                filter: `blur(1px) drop-shadow(0 0 8px ${c.glow})`,
                transition: 'height 0.3s ease',
              }}
            />
            {/* Inner flame */}
            <div
              className="flame-inner-anim absolute"
              style={{
                top: 4, left: '50%', transform: 'translateX(-50%)',
                width: 14,
                height: 35,
                background: `linear-gradient(to bottom, white, ${c.flameInner}, ${c.flame[0]}, transparent)`,
                clipPath: 'polygon(25% 0%, 75% 0%, 90% 40%, 50% 100%, 10% 40%)',
                filter: 'blur(0.5px)',
              }}
            />
            {/* Ground glow */}
            <div
              style={{
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 16,
                background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`,
                animation: 'exhaust-glow 0.1s ease-in-out infinite',
              }}
            />
          </div>
        )}
      </div>

      {/* Smoke particles */}
      <div className="pointer-events-none absolute bottom-0 w-full overflow-visible">
        {smokeParticles.slice(-8).map((p) => (
          <SmokeParticle key={p.id} delay={p.delay} />
        ))}
      </div>

      {/* Ground exhaust halo when launching */}
      {(isShaking || isLaunching) && (
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 20,
            background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`,
            animation: 'exhaust-glow 0.12s ease-in-out infinite',
            opacity: isLaunching ? 1 : 0.6,
          }}
        />
      )}
    </div>
  )
}
